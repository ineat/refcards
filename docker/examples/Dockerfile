FROM mongo:4.0.2
COPY init.json /init.json
CMD mongoimport --host mongodb --db exampleDb --collection contacts --type json --file /init.json --jsonArray