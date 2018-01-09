const fs = require('fs');
const parseString = require('xml2js').parseString;
const mongoose = require('mongoose');
const {lstatSync, readdirSync} = require('fs');
const {join} = require('path');
const dir = process.argv[2];

mongoose.connect('mongodb://localhost/jmeter_results');

let jtl_schema = mongoose.Schema({
    elapsed_time: Number,
    idle_time: Number,
    latency: Number,
    connect_time: Number,
    time_stamp: Date,
    error_flag: Number,
    label: String,
    response_code: Number,
    response_message: String,
    thread_name: String,
    data_type: String,
    bytes: Number,
    sent_bytes: Number,
    active_threads_group: Number,
    active_threads_all: Number,
    build: Number
});

let jtl_document = mongoose.model('daily_prom_test', jtl_schema);

// push_data(dir);
let dir_arr = readdirSync('../builds/');
dir_arr.forEach(dir=>{push_data(dir)});


function push_data(dir) {
    console.log('read ' + __dirname + '/builds/' + dir + '/performance-reports/JMeter/test_results.jtl');
    fs.readFile(__dirname + '/../../builds/' + dir + '/performance-reports/JMeter/test_results.jtl', function (error, file) {
        if (error) {
            // throw error
        } else {
            parseString(file, (error, result) => {
                    if (error) {
                        // throw error
                    } else {
                        let items = [];
                        result.testResults.httpSample.forEach(results_item=>{
                            let rows = results_item;
                            // console.log(!!rows.$.s);
                            let jtl = {
                                elapsed_time: rows.$.t ? rows.$.t : null,
                                idle_time: rows.$.it ? rows.$.it : null,
                                latency: rows.$.lt ? rows.$.lt : null,
                                connect_time: rows.$.ct ? rows.$.ct : null,
                                time_stamp: new Date(parseInt(rows.$.ts)),
                                error_flag: rows.$.s === 'true' ? 0 : 1,
                                label: rows.$.lb ? rows.$.lb : null,
                                response_code: !isNaN(parseInt(rows.$.rc)) ? rows.$.rc : null,
                                response_message: rows.$.rm ? rows.$.rm : null,
                                thread_name: rows.$.tn ? rows.$.tn : null,
                                data_type: rows.$.dt ? rows.$.dt : null,
                                bytes: rows.$.by ? rows.$.by : null,
                                sent_bytes: rows.$.by ? rows.$.by : null,
                                active_threads_group: rows.$.ng ? rows.$.ng : null,
                                active_threads_all: rows.$.na ? rows.$.na : null,
                                build: dir
                            };
                            items.push(jtl)

                        });
                        handle_results(items)
                    }
                }
            );
        }

    });


}

function handle_results(items) {
    console.log('handle_results');
    console.log(items[0].build);
    new Promise(function(resolve, reject) {
        jtl_document.insertMany(items, function(error, docs) {
        if(error){
            reject(error)
        }else{
            // console.log(docs);
            resolve(true)
            // process.exit(0)
        }
    });
    })


}

