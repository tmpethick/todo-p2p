# To-do

#### Install dependencies

This project require `npm` and `nodejs`. Get it [here](https://nodejs.org/en/download/).

Now install developer dependencies (make sure you `cd` into the directory where `package.json` exists). 

```
npm install
```

### Development

This will: 

1) watch the `js` to recompile on changes and livereload the website.
2) Host the to-do website and PeerJS broker on [http://localhost:3000](http://localhost:3000).

```
npm run dev
```

These to processes can be run manually (problems running them combined have been deteched on Windows):

```
npm run watch
npm start
```

### Where to look

The applications entry point is `js/main.js`. 
Here the heighest level react components is initialised as well as the network and tuplespace.

### Deploy

Deployment is done with [dokku](http://dokku.viewdocs.io/dokku/).

```
git remote add prod dokku@withbarehands.com:todo
git push prod master
```

This will run `npm run build` to build a production ready `js` bundle. Afterwards it will run `node server.js` to start the server.
