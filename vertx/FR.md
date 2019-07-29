# Vertx RefCard

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
    * [Servir des pages web](#servir-des-pages-web)
    * [Stocker des données : les sessions](#stocker-des-donnes--les-sessions)
    * [Stocker des données : les cookies](#stocker-des-donnes--les-cookies)
    * [Saisir des données : les formulaires](#saisir-des-donnes--les-formulaires)
6. [Distribuer les services](#distribuer-les-services)
    * [Event Bus – Théorie](#event-bus---thorie)
    * [Event Bus – En local](#event-bus---en-local)
    * [Event Bus – En cluster](#event-bus--en-cluster)
    * [Service Discovery - Théorie](#services-discovery---thorie)
    * [Service Discovery - Mise en pratique](#services-discovery---mise-en-pratique)
7. [Tester l'application](#tester-lapplication)


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


### Servir des pages web

Solution idéale pour construire rapidement des APIs légères et réactives, Vertx permet également de servir du contenu HTML.

#### Dépendances nécessaires

// IMAGE

#### Exposer des ressources statiques

Servir des ressources statiques (comme les fichiers css ou les images) nécessite l’utilisation d’un __StaticHandler__ qui, en fonction des demandes, transmettra les fichiers stockés dans un répertoire du filesystem. Par défaut ce répertoire est __webroot__, mais il est tout à fait possible de pointer sur un autre répertoire via la méthode __setWebRoot__ du __StaticHandler__.

```java
router.route("/static/*").handler(StaticHandler.create());
```

#### Servir une page HTML

Tout comme les réponses retournées par des APIs, servir du contenu HTML se fait avec __routingContext.response().end(…)__. Le contenu renvoyé ici est passé en paramètre de la méthode end et sera dans ce cas du code HTML.

#### Le templating

Plusieurs moteurs de templates peuvent être utilisés conjointement avec Vertx afin de rendre un contenu HTML (Thymeleaf, Freemarker, Jade, …).

```java
router.get("/page").handler(
        routingContext -> {
            ThymeleafTemplateEngine engine = ThymeleafTemplateEngine.create();
            engine.render(routingContext, "templates", "page.html", res -> {
                        if (res.succeeded()) {
                            routingContext.response().end(res.result());
                        }
                    });
});

```

Outre le __RoutingContext__, la méthode __render__ de __ThymeleafTemplateEngine__ prend en paramètre le nom du répertoire contenant les templates, le nom du template à utiliser et un handler à exécuter (en générale cet handler renverra le code HTML généré).

### Stocker des données : les sessions

#### Dépendances nécessaires

// IMAGE

#### Types de stockage

Le stockage des données en session passe par la création d’une instance de __SessionStore__. Cette classe permet de spécifier le nom de la map qui contiendra les données de session.

```java
SessionStore sessionStore = LocalSessionStore.create(vertx, "map");
``` 

// IMAGE

Dans sa forme la plus simple, le stockage se fait localement au sein d’un même serveur http. Cependant en production, plusieurs instances d’un même verticle peuvent exister au sein d’un même cluster. Les sessions sont donc amenées à être partagées entre plusieurs serveurs http. Dans ce cas de figure, il sera nécessaire d’utiliser __ClusturedSessionStore__ et non __LocalSessionStore__. Les sessions seront alors stockées dans une map distribuée. 

__Bien que tout à fait faisable avec Vertx, le stockage des données en session est cependant à éviter : pour suivre les principes de scalabilité et de résilience il est conseillé de favoriser le stateless.__

#### Accès aux données

L’accès aux données de session suit le même schéma que l’accès au body des requêtes POST. On déclare le __SessionHandler__, qui sera associé au __router__.

```java
SessionHandler sessionHandler = SessionHandler.create(sessionStore);
router.route().handler(sessionHandler);
```

L’accès aux données pourra alors être opéré par le biais d’un objet __Session__, obtenu via un appel au __RoutingContext__. Session se manipule comme une HashMap classique.

```java
Session session = routingContext.session();
session.put("key", "value");
```

### Stocker des données : les cookies

#### Dépendances nécessaires

// IMAGE

#### Mise en oeuvre

De la même façon que pour les sessions, l’accès aux données stockées sous forme de cookies se fait par le biais d’un handler spécifique : __CookieHandler__.

```java
router.route().handler(CookieHandler.create());
```

Le __RoutingContext__ permettra de stocker de nouveaux cookies et de manipuler leurs données.

```java
routingContext.addCookie(Cookie.cookie("cookie-example", "value"));
//...
Cookie cookieExample = routingContext.getCookie("cookie-example");
String value = cookieExample.getValue();
```

### Saisir des données : les formulaires.

#### Dépendances nécessaires

// IMAGE

#### Créer le formulaire

La création d’un formulaire exploitable par Vertx n’a pas de prérequis particuliers, seul l’attribut __name__ des inputs est essentiel : c’est avec son nom qu’on pourra rechercher un input et accéder à sa valeur. 

```xml
<form method="post">
        <input type="radio" id="input1" name="radio1" value="A"/>
        <input type="radio" id="input2" name="radio2" value="B"/>
        <input type="radio" id="input3" name="radio3" value="C"/>
</form>
```

#### Récupérer les données saisies

Comme précisé dans la partie précédente le nom de l’input est important, car il permet de récupérer la valeur saisie avec la méthode __getFormAttribute__ de __HttpServerRequest__ (qui prend en paramètre le nom de l’input).

```java
routingContext.request().getFormAttribute("radio1")
```

Une autre méthode (__formAttributes__), également fournie par __HttpServerRequest__, offre la possibilité de récupérer l’ensemble des inputs sous la forme d’une __MultiMap__.

## Distribuer les services

// IMAGE

### Event Bus - Théorie

Véritable système nerveux de Vertx, l’event bus permet à différentes entités d’une application de communiquer entre-elles via échanges de messages (entités qui peuvent se trouver ou non dans la même instance Vertx). Un des principaux intérêts est que les parties communicantes peuvent être écrites dans des langages différents, mais qu’il est également tout à fait envisageable de lier du code Javascript, exécuté dans un navigateur, à l’Event Bus (via __SockJs__ par exemple).
L’envoi de messages sur le bus se fait sur une adresse, qui n’est ni plus ni moins qu’une simple chaine de caractères. Chaque __consumer__ (qui est généralement un verticle) reçoit et traite les messages en s’abonnant à cette adresse (modèle __publish / subscribe__). Il supporte aussi le modèle point à point et request/response. 
On retrouve donc l’aspect « message oriented » du manifeste reactive. Ce bus va nous permettre de découpler les composants, et de profiter d’une scalabilité horizontale (un verticle du cluster va prendre le message).

// IMAGE

### Event Bus - En local

#### Dépendances nécessaires

// IMAGE

#### Réception des messages (Abonnements)

```java
@Override
public void start() {
  // ...
  vertx.eventBus().consumer( "address-A", message -> System.out.println(message.body()));
}
```

Dans cet exemple on affiche le contenu du message réceptionné à l’adresse « address-A ».

#### Envoi des messages

La publication d’un message peut se faire de deux façons : 
-	Via la méthode __publish__ -> l’ensemble des consommateurs abonnés à l’adresse traiterons le message (__modèle publish / subscribe__).
-	Via la méthode __send__ -> un seul consommateur traitera le message même si d’autres sont abonnés à la même adresse (__modèle point to point__).
Ces deux méthodes prennent en paramètre l’adresse de publication et le contenu du message.

```java
vertx.eventBus().publish("address-A", "Message content");
vertx.eventBus().send("address-A", "Message content");
```

### Event Bus – En cluster

Dans sa forme la plus simple, la communication inter-verticle se fait au sein de la même instance Vertx sans aucune complexité. Cependant dans le cas d’applications distribuées, plusieurs instances Vertx peuvent coexister sur le réseau et être exécutées sur des JVM différentes. Or chaque instance gère son propre Event Bus. Il est donc nécessaire de s’appuyer sur un Cluster Manager qui permettra de grouper les instances et constituer un seul Event Bus partagé.

// IMAGE


#### Dépendances nécessaires

// IMAGE

#### Mise en oeuvre

```java
//…
  ClusterManager mng = new HazelcastClusterManager();
  VertxOptions options = new VertxOptions().setClusterManager(mng);
  Vertx.clusteredVertx(options, res -> {
    if (res.succeeded()) {
      Vertx vertx = res.result();
      vertx.eventBus().publish("address-B", "Message content");
    }});
```

On instancie un __HazelcastClusterManager__ qui sera ensuite utilisé pour initialiser le cluster. Si c’est un succès, la suite des opérations sera la même que pour une exécution locale. Vertx supporte d’autres Cluster Manager comme Zookeeper (__ZookeeperClusterManager__ du module __vertx-zookeeper__), Infinispan (__InfinispanClusterManager__ du module __vertx-infinispan__), Ignite (__IgniteClusterManager__ du module __vertx-ignite__).
Qu'il soit local ou distribué l'event bus permet donc aux composants d'une application d'échanger facilement des données de manière asynchrone et non-bloquante, et ne nécessite pas l'intervention d'un broker de messages.

### Services Discovery - Théorie

Chaque entité d’un système peut être vue comme un service. Qu’il s’agisse de endpoints HTTP, de sources de données ou d’un proxy, chaque service peut être décrit et référencé dans annuaire dans le but d’être appelable par les autres services sans que ceux-ci n’aient connaissance de l’adresse de ce service. Tout comme pour l’Event Bus, ce mécanisme, appelé découverte de services, garantie donc une certaine __transparence de localisation__.

// IMAGE

Ce schéma illustre ce concept : les endpoints d’__Account Service__ (exposés par __Account Verticle__) sont référencés dans le__ Service Registry__. Ce dernier est observé et utilisé par le Customer Service pour récupérer l’adresse d’Account Service et donc déterminer comment appeler les endpoints exposés par __Account Verticle__. 
Vertx propose ses propres classes permettant de monter un annuaire de service, mais offre également des connecteurs pour interagir avec d’autres solutions (Consul par exemple, via le client mis à disposition par __vertx-consul-client__).

### Services Discovery - Mise en pratique

#### Dépendances nécessaires

// IMAGE

#### Créer l'annuaire de services

La création d’un annuaire de services avec Vertx implique l’instanciation d’un objet __ServiceDiscovery__ :

```java
ServiceDiscovery discovery = ServiceDiscovery.create(vertx);
```

#### Référencer un service dans l'annuaire

La publication d’un service (ci-dessous un endpoint http) revient à ajouter un __Record__ dans l’annuaire. Chaque service référencé est caractérisé par un nom, une localisation, et optionnellement des métadonnées.

```java
Record record = HttpEndpoint.createRecord("service-name", "address", 8080, "/test");
discovery.publish(record, ar -> {
  if (ar.succeeded()) {
    System.out.println("Service published");
  }});
```

#### Rechercher un service dans l'annuaire

Il est possible de rechercher des services en utilisant des filtres (applicables sur différentes caractéristiques d’un service) :

```java
discovery.getRecord(r -> r.getName().equals("service-name"), ar -> {
  if (ar.succeeded()) {
    System.out.println("Service found");
  }});
```

L’appel au service pourra ensuite se faire comme suit (la méthode __getAs__ prenant en paramètre le type de service à récupérer) :

```java
if (ar.succeeded()) {
    Record record = ar.result();
    ServiceReference serviceReference = discovery.getReference(record);
    HttpClient client = serviceReference.getAs(HttpClient.class);
    client.get("http://address:port/resource").end();
    // ...
    serviceReference.release();
}
```

## Tester L'application

// IMAGE