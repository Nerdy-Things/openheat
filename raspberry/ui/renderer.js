const ejs = require('ejs');

module.exports = {
    render: (req, res, file, data) => {
        ejs.renderFile(__dirname + file, data, {}, function(err, str){
            if (err) {
                console.log(err)
                res.status(500).send(str);
                return
            }
            ejs.renderFile(__dirname + "/bootstrap.html", {content: str}, {}, function(err, str){
                if (err) console.log(err)
                res.status(200).send(str);
            });
        });
    }
}