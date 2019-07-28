#Vertx RefCard

*Version française*

RefCard d'utilisation de Vertx 3.8.0

Ecrit par Mathias Deremer-Accettone

## Sommaire

1. [Vertx, kesako ?](#vertx-kesako-)
2. [Définitions et Terminologie](#dfinitions-et-terminologie)
3. [Qui utilise Vertx ?](#qui-utilise-vertx-)
4. [Concevoir des APIs avec Vertx](#concevoir-des-apis-avec-vertx)
    * [Ma première API](#ma-premire-api)
    * [Paramètres d’une requête](#paramtres-dune-requte)
    * [API Contract - Théorie](#api-contract---thorie)
    * [API Contract – Mise en Pratique](#api-contract---mise-en-pratique)
    * [Exécuter du code bloquant – Théorie](#executer-du-code-bloquant---thorie)
    * [Executer du code bloquant – Mise en pratique](#executer-du-code-bloquant---mise-en-pratique)
    * [Circuit Breaker](#circuit-breaker)
5. [Vertx pour le web](#vertx-pour-le-web)


## Vertx, kesako ?

Vertx est souvent défini comme un framework événementiel fortement inspiré de Node.js. Cependant, contrairement à un véritable framework, Vertx ne donne pas de cadre réel pour dessiner nos applications et relève donc plus du toolkit que d'un framework.

### Born to be reactive

En tant que boîte à outils événementielle, Vertx est donc très bien adapté au développement de systèmes performants en apportant une solution aux quatre piliers de l’architecture reactive (extrait du Reactive Manifesto) :

// IMAGE

### Polyglotte

Un autre aspect intéressant de Vertx : il est polyglotte. Les composants peuvent être développés en Java, Kotlin, Javascript, Ceylon, Groovy, Ruby, Scala.
Vous pouvez vous mettre à vertx ou développer un premier micro service sans quitter votre langage favori, de quoi se mettre le pied à l’étrier et s’approprier les concepts. Par contre petit bémol, n’oubliez pas que seuls les composants Java sont les plus up to date… 

// IMAGE

## Définitions et Terminologie

Avant toute chose, petit focus sur la terminologie de Vertx.

### Verticle

Composant de base déployé et exécuté au sein de toute application Vertx. Un verticle a généralement pour rôle d'exposer des handlers. Une application peut exposer un ou plusieurs verticles qui ont des périmètres techniques ou fonctionnels différents. Soulignons que les verticles peuvent être de différent type : les verticles « classiques » orchestrés par l’Event Loop, et les workers.
Les workers ont un cycle de vie particulier puisqu’ils fonctionnent sur leurs propres threads. Ils sont généralement utilisés pour exécuter du code bloquant comme les écritures en base de données s’appuyant sur JDBC.

### Handler

Rappelez-vous Vertx est évènementiel, il va donc falloir traiter ces évènements : c’est le rôle de vos handlers. Requête http ou message, vos traitements devront ne pas être bloquant : « don’t block the event loop » !

### Event Loop (Boucle d'événements)

L’Event Loop est en charge de la répartition des événements entrants (ex : arrivée d'une requête HTTP) vers le bon Handler, comme le montre le schéma suivant :

// IMAGE

Ce concept est bien connu des développeurs Node.js Cependant contrairement à Node.js, chaque instance Vertx peut maintenir plusieurs instances (threads) d'Event Loop. Par défaut le nombre d’instances correspond au nombre de core multiplié par 2.

## Qui utilise Vertx ?

Encore peu répandu il y a quelques années, Vertx bénéficie aujourd’hui d’une communauté conséquente et est utilisé par de nombreuses entreprises. Citons par exemple Michelin avec leur plateforme de collecte de données issues de pneus connectés, Red Hat et son Framework Quarkus qui s’appuie en partie sur Vertx, ou encore la solution d’API Management Gravitee.

// IMAGE

## Concevoir des APIs avec Vertx

// IMAGE

### Ma première API

#### Dépendances nécessaires

// IMAGE

#### Permier handler

Définir un handler revient à implémenter l’interface __Handler__. La méthode __handle__ est invoquée à chaque déclenchement d’handler, et prend en paramètre un __RoutingContext__ qui va vous permettre d’interagir sur le contexte http.

```java
public class HelloWorldHandler implements Handler<RoutingContext> {
  @Override
  public void handle(RoutingContext routingContext) {
     routingContext.response().end("Hello world !!");
  }
}
```

#### Création du verticle et déclaration du router

Le router permet de déterminer dans quels cas le handler sera invoqué (par méthode http, expressions régulières…).

```java
public class HelloVerticle extends AbstractVerticle {
  @Override
  public void start() {
    Router router = Router.router(vertx);
    router.get("/hello").handler(new HelloWorldHandler());
    vertx.createHttpServer().requestHandler(router).listen(8080);
  }
}
```

Par définition, un verticle est une classe qui étend __AbstractVerticle__, et dans laquelle est surchargée la méthode __start__. Le __Router__ permet d’associer les requêtes d’URL « /hello » et de type __GET__ au handler définit précédemment. Un serveur http est ensuite créé et mis en écoute sur le port 8080.

// IMAGE

### Paramètres d'une requête

#### Dépendances nécessaires

// IMAGE

#### Query params

```java
MultiMap parameters = routingContext.request().params()
```

#### Path params

##### Déclaration 

Implique la modification de l’url déclarée dans le __Router__ en déclarant les paramètres avec __:[nom]__

```java
router.delete("/example/:id").handler(new DeleteExampleHandler());
```

##### Récupération

L’accès au paramètre se fait ensuite comme suit côté Handler :

```java
routingContext.request().getParam("id");
```

#### Body params

##### Déclaration

L’accès au body d’une requête POST implique l’ajout d’un __BodyHandler__ au router (côté verticle).

```java
router.route().handler(BodyHandler.create()); 
router.post("/example").handler(new PosExampletHandler());
```

##### Récupération

Côté Handler l’accès au body se fera via __RoutingContext__.

```java
JsonObject jsonObject = routingContext.getBodyAsJson();
JsonArray jsonArray = routingContext.getBodyAsJsonArray();
Buffer buffer = routingContext.getBody();
String body = routingContext.getBodyAsString();
```

### API Contract - Théorie

Lorsqu’on conçoit des APIs on a parfois l’habitude de rédiger du code et d’en générer la documentation (Swagger ou OpenApi). Comme vu précédemment, créer rapidement des routes et y associer des handlers est très simple, la documentation pouvant être écrite dans un second temps. Mais Vertx offre également une autre approche grâce à l’API Contract : ici on écrit la SwaggerDoc qui contiendra les spécificités de nos APIs, puis on passe au code. Ce mécanisme repose sur l’utilisation de la classe __OpenAPI3RouterFactory__, dont la fonction est de générer un router à partir du fichier YAML contenant la documentation (et donc les routes de nos APIs).
Cependant API Contract ne se limite pas uniquement à cela puisqu’il permet, entre-autre, de générer automatiquement les handlers de validation : si une requête entrante ne respecte pas le format spécifié dans la documentation, une erreur 400 sera alors renvoyée à l’appelant. 
La contrainte (qui n’en est finalement pas une) est bien évidemment d’avoir une documentation rigoureusement maintenue, et les avantages sont nombreux : moins de code à écrire, __BodyHandler__ généré automatiquement pour les requêtes POST, davantage de contrôles sur les requêtes entrantes, …

// IMAGE

1 -	La __RouterFactory__ analyse le fichier Swagger.

2 -	Un __Router__ est généré par la RouterFactory à partir du contenu de la SwaggerDoc.

3 -	Les routes correspondant aux endpoints spécifiés dans la SwaggerDoc sont exposées et liées aux handlers (__BodyHandler__ et __ValidationHandler__ étant automatiquement générés).

### API Contract - Mise en pratique

#### Dépendances nécessaires
// IMAGE

#### La documentation

La documentation Swagger est écrite en YAML et suit les spécifications OpenApi. On ajoute simplement un __operationId__ à chaque endpoint spécifié dans la SwaggerDoc (ils permettront de faire le lien avec les handlers à invoquer).

```yaml
...
paths:
  /users/{userId}
    get:
      summary: Get user by id
      operationId: getUserById
      parameters:
        ...

```

#### Création de la RouterFactory

```java
OpenAPI3RouterFactory.create(vertx, "src/main/resources/swaggerdoc.yaml", ar -> {
    if (ar.succeeded()) {
       OpenAPI3RouterFactory routerFactory = ar.result();
    }
});
```

__OpenAPI3RouterFactory__ dispose d’une méthode create, prenant, entre autre, un path de fichier YAML, et un handler dans lequel seront associés opérations et handlers correspondant. 

#### Association opérations / handlers et génération du router.

```java
routerFactory.addHandlerByOperationId("getUserById", new GetUserHandler());
routerFactory.addHandlerByOperationId("createUser", new PostUserHandler());
routerFactory.addHandlerByOperationId("deleteUser", new DeleteUserHandler());
```

L’instance de OpenAPIRouterFactory nous permet de faire l’association entre les operationId spécifiés dans la documentation swagger et les handlers.
La génération du router pourra ensuite être effectuée avec :

```java
Router router = routerFactory.getRouter();
```

### Executer du code bloquant - Théorie

On opte généralement pour Vertx lorsque le caractère non-bloquant d’un projet est un critère important. Il y a donc une règle à laquelle il ne faut pas déroger : ne __jamais bloquer l’Event Loop__. Cependant il arrive qu’il soit nécessaire de repasser sur un mode synchrone et exécuter des opérations bloquantes. Un cas typique est l’écriture en base de données via JDBC. 
Vertx permet de réaliser ce type d’opération avec des verticles particuliers, appelés Workers. Ceux-ci n’ont pas le même cycle de vie que les verticles classiques car non administré par une Event Loop : un Worker est exécuté avec un thread provenant du pool de Workers.
Afin de simplifier l’allocation des threads dédiés à l’exécution des workers, Vertx administre des Pools, nous offrant ainsi la possibilité de paramétrer le nombre de threads disponibles et donc de tâches bloquantes pouvant s’exécuter en même temps. 

// IMAGE

### Executer du code bloquant - Mise en pratique

#### Dépendances nécessaires

// IMAGE

#### Méthode 1 : lors du déploiement

Comme précisé plus haut, un worker est un verticle comme les autres. La différence fondamentale est qu’il sera exécuté depuis un thread issu du pool de thread de vertx dédié aux worker et non via l’event loop.

```java
DeploymentOptions opts=new DeploymentOptions().setWorker(true);
Vertx.vertx().deployVerticle(new ExampleVerticle(), opts);
```

Lors du déploiement d’un verticle, il est possible de spécifier des __DeploymentOptions__, permettant entre autre de préciser s’il doit être déployé comme worker. Il est également possible de paramétrer le nombre maximal de threads d’un pool avec la méthode __setWorkerPoolSize__. 

```java
DeploymentOptions opts=new DeploymentOptions()
     .setWorker(true)
     .setWorkerPoolSize(3);
Vertx.vertx().deployVerticle(new ExampleVerticle(), opts);
```

#### Méthode 2 : avec les exécutors

Une autre méthode pour exécuter du code bloquant consiste à utiliser la classe __WorkerExecutor__. Cette classe dispose d’une méthode __executeBlocking__ permettant, comme son nom l’indique, d’exécuter des portions de code bloquant. Les blocs de code encapsulés par la méthode __executeBlocking__ seront traités par un thread du pool de workers. 

```java
WorkerExecutor workerExecutor = vertx.createSharedWorkerExecutor("worker-pool-example", 3);
workerExecutor.executeBlocking(future -> {
    //...
}, res -> {
    // ...
});
```

Ici chaque tâche exécutée avec __executeBlocking__ sera traitée par un thread du pool « worker-pool-example », créé avec __createSharedWorkerExecutor__.

### Circuit Breaker

Le pattern Circuit Breaker permet d’assurer la résilience de l’application, en offrant des scénarios alternatifs en cas de défaillances afin de garantir une continuité de service.

// IMAGE

#### Dépendances nécessaires

// IMAGE

#### Initialisation 

```java
CircuitBreaker breaker = CircuitBreaker.create("breaker-example", vertx,
  new CircuitBreakerOptions()
    .setMaxFailures(5)// (1)
    .setMaxRetries(3)// (2)
    .setTimeout(2000)// (3) 
);
```

Le circuit breaker est défini par le biais de __CircuitBreakerOptions__. Ici on définit le seuil d’échecs tolérés avant de passer le circuit en statut ouvert (1), le maximum de tentatives d’exécution d’une requête avant d’incrémenter le compteur d’échecs (2), et le temps de réponse maximum au-delà duquel on considère la requête en erreur (3). 

#### Gestion des cas d'erreurs

```java
breaker.executeWithFallback(future ->
  WebClient.create(vertx)
    .get(8080, "address", "/test")
    .send(response -> { /*...*/ })
), fallback -> { System.out.print(“Target application can’t be called");
}).setHandler(ar -> System.out.print("Success”));
```

## Vertx pour le web

// IMAGE