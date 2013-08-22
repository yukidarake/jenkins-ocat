var app = app || {};

(function() {
    var Result = app.Result = function Result(config) {
        this.config = config;
    };

    Result.prototype.parse = function(message) {
        var job = JSON.parse(message.data);

        this.job = job;
        this.url = this.config.jenkinsUrl + '/job/' +
            job.project + '/' + job.number + '/';
        this.project = job.project;
        this.time = new Date(message.timeStamp + 1000 * 60 * 60 * 9)
                .toISOString().replace('T', ' ').replace(/\..+$/, '');
        this.isSuccess = job.result === 'SUCCESS';
        this.type = this.isSuccess ? 'OK' : 'NG';
    };

    Result.prototype.isTarget = function() {
        var job = this.job;
        if (job.status && !/SUCCESS|FAILURE/.test(job.status)) {
            return false;
        }

        var jobRegExp = this.job.jobRegExp;
        if (jobRegExp && !(new RegExp(jobRegExp).test(job.project))) {
            return false;
        }

        return true;
    };
})();

