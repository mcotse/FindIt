# Findit
<a href="https://www.youtube.com/watch?v=Ol8lHoxVIQY&feature=youtu.be" target="_blank"><img src="http://img.youtube.com/vi/Ol8lHoxVIQY/0.jpg" 
alt="IMAGE ALT TEXT HERE" width="640" height="480" border="5" /></a>
##Amazon Echo Hackathon 2016
Can't find it? FindIt!

## Inspiration
 - We hate dealing with people, so we deal with Alexa instead

## What it does
 - Look for an item in the store by asking Alexa to FindIt

## How we built it
 - built a Lambda function that hooks up to the DynamoDB with node

## Challenges we ran into
 - Alexa being too sensitive
 - Perfecting utterances training dataset

## Accomplishments that we're proud of
 - Keeping the UX as simple and fluent as possible

## What we learned
 - Building a skill for Alexa
 - Setting up AWS Lambda functions
 - Setting up AWS DynamoDB
 - Working with speech intents
 - Dealing with Echo

## What's next for Findit
 - Adding in data analytics
 - UI to update and display store map/route realtime
 - QR code to sync to customer's device so they can keep a log

## Built with
`node.js` `javascript` `amazon-echo` `amazon-alexa` `amazon-lambda` `amazon-dynamoDB`

## Usage
Once compiled and setup on AWS and Amazon Echo, the app can be started by saying : `Alexa, open FindIt` <br>
Find an item by asking : `Where is {item}?`
