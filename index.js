const https = require('https');
const express = require('express');
const app = express();
const PORT = 3000;

app.listen(PORT, () => {
    console.log('listening on port ' + PORT);
});

app.get('/get-latest-stories', (req, res) => {
    https.get('https://time.com/', (response) => {
        let data = '';
        let titles = [];
            response.on('data', (chunk) => {
                data += chunk;
            });
            response.on('end', () => {
                let latestStories = data.match(/<h3 class="latest-stories__item-headline">(.*?)<\/h3>/g);

                let latestStoriesText = latestStories.map(story => {
                    return story.match(/<h3 class="latest-stories__item-headline">(.*?)<\/h3>/g)[0].replace(/<h3 class="latest-stories__item-headline">/g, '').replace(/<\/h3>/g, '');
                });
               
                latestStoriesText.forEach(story => {
                    titles.push({title: story.replace(/<\/?[^>]+(>|$)/g, "")});
                });

                res.send(titles);
            });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    })
});