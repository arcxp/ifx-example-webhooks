## Let us know if you find any issues with these instructions or the code. Cheers!

## Setup
You will have to create an account and workflow to receive a [Pipedream URL](https://pipedream.com/) to which you will send the data.

I have set up a very simple workflow, with a custom code return as:
```
export default defineComponent({
  async run({ steps, $ }) {
    await $.respond({
      status: 200,
      headers: {},
      body: "hello world!",
    })
  },
})
```

## Running the integration locally
run `npm i`

run `npm run localTestingServer`

### Send POST
Send a POST request to `http://127.0.0.1:8080/ifx/local/invoke/`, with the body:
```
{
    "key": "custom:sendToPipedream",
    "body": {
        "test": 123,
        "other": true
    }
}
```

### Return
You should see a return from your post as "we did it!"
and in your console log
```
{ test: 123, other: true }
------------response
hello world!
we did it!
```

## Running the integration on Sandbox
_This assumes you have [created an integration] (https://alc-swagger-template.s3.amazonaws.com/docs/swagger/index.html?url=ifx/admin/prod/swagger.json#operations-integrations-Create-a-new), [uploaded, deployed, and promoted](https://alc-swagger-template.s3.amazonaws.com/docs/swagger/index.html?url=ifx/admin/prod/swagger.json#operations-tag-bundles) your code to Sandbox._

### Create a custom event
`POST /ifx/api/v1/admin/events/custom`
```
{
  "eventName": "custom:sendToPipedream",
  "integrationName": "{integrationName}",
  "enabled": true
}
```

### Create a Webhook URL
`POST /ifx/api/v1/admin/events/custom/custom:sendToPipedream/webhooks`
```
{
  "description": "Here is a webhook"
}
```

### Subscribe the integration to the event
`POST /ifx/api/v1/admin/events/subscriptions`
```
{
  "eventName": "custom:sendToPipedream",
  "enabled": true,
  "integrationName": "{integrationName}"
}
```

### POST your payload to the Webhook URL
`POST https://api.sandbox.{orgName}.arcpublishing.com/ifx/api/v1/webhook/UUID`
```
{
  "test": "testing"
}
```

### Go to Pipedream and see your POST request and its body being sent
![Screenshot](pipedream.jpg)