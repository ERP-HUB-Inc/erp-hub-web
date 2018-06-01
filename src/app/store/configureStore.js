if (process.env.NODE_ENV === "production") {
  	module.exports = require("./configureStore.prod");
} else {
	console.log("===========Load Store Development===========");
  	module.exports = require("./configureStore.dev");
}