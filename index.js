var jobmodule=require("./jobs.js");

if (process.env.CRAWL_INTERVAL === undefined || process.env.CRAWL_INTERVAL === null) {
    var crawl_interval = 10;
}
else{
    var crawl_interval = parseInt(process.env.CRAWL_INTERVAL);    
}
jobmodule.schedulepage();
setInterval(jobmodule.schedulepage, crawl_interval * 1000 * 60);