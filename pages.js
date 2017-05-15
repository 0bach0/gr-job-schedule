var request = require("request");
var pagemodule = require("./pages.js");
var kue = require("kue");                                                    
var jobs = kue.createQueue(
        {redis:{
            host: 'jobqueue-db'
        }}
    ); 

exports.getpages = ()=>{
    return new Promise(function(resolve,reject){
        var url = "http://page-manager:3000/pages"
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var pages = JSON.parse(response.body).message;
                resolve(pages);
            }
            else{
                reject();
            }
        });
    });
}

exports.checkexistjob = (page)=>{
    return new Promise(function(resolve,reject){
        // console.log(page);
        // resolve(page);
        jobs.inactive( function( err, ids1 ) {
            jobs.active( function( err, ids2 ) {
                var ids = ids1.concat(ids2);
                
                if(ids.length==0){
                    resolve(page);
                    return;
                }
                
                ids.forEach( function( id , index ) {
                    kue.Job.get( id, function( err, job ) {
                        
                        if(job.data.id===page.id){
                            reject(page.id);
                            return;
                        }
                        if(index == ids.length-1){
                            resolve(page);
                        }
                    });
                });
            })
        });
    });
}