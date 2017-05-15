var kue = require("kue");                                                    
var jobs = kue.createQueue(
        {redis:{
            host: 'jobqueue-db'
        }}
    ); 


jobs.process('page', function (job, done){
    console.log(job.data);
    done();
});