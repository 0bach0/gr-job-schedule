var pagemodule = require("./pages.js");
var kue = require("kue");                                                    
var jobs = kue.createQueue(
        {redis:{
            host: 'jobqueue-db'
        }}
    ); 

var request = require("request");

exports.schedulepage = ()=>{
    pagemodule.getpages().then((pages)=>{
        for(var x in pages){
            var page = pages[x];
            
            pagemodule.checkexistjob(page)
            .then((page)=>{    
                var job = jobs.create('page', {
                    title: 'Update page ' + page.name
                  , id:page.id
                  , time_limit:page.time_limit
                  , last_update:page.last_update
                }).save( function(err){
                  if( !err ) console.log( 'New job ',job.id );
                });
                
                job.on('complete', function(result){
                    console.log(page.id);
                    var last_update = Math.floor((new Date).getTime()/1000);
                    
                    request.post(
                        'http://page-manager:3000/page',
                        { json: { id: page.id,last_update:last_update } },
                        function (error, response, body) {
                            if (!error && response.statusCode == 200) {
                                console.log("Update last_update",page.id);
                            }
                        }
                    );
                })
            })
            .catch((err)=>{
                console.log("Existed",err);
            });
        }
    })
}