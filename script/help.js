// CREATE JSON OF IMAGES

var folder = "gifs/new/";
let newData = [];

$.ajax({
    url: folder,
    success: function (data) {
        $(data).find("a").attr("href", function (i, val) {
            if (val.match(/\.(jpe?g|png|gif)$/)) {
                // $("body").append("<img src='" + val + "'>");

                let tester = {
                    "file": `${val}`,
                    "cat": "merkle",
                    "tags": []
                };

                newData.push(tester);
            }
        });
    }
});

setTimeout(() => {
    console.log(JSON.stringify(newData));
}, 1000);