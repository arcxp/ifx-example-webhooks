Example code is provided by a community of developers. They are intended to help you get started more quickly, but are not guaranteed to cover all scenarios nor are they supported by Arc XP.

> These examples are licensed under the [MIT license](https://mit-license.org/): THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

Reiterated from license above, all code in this example is free to use, and as such, there is NO WARRANTY, SLA or SUPPORT for these examples.

## Description
In this example we will walk through using Inbound Webhooks so that an external service can invoke an integration (with authentication) to "alert" the integration when something has happened (i.e. processing of an audio file is complete). Pipedream is used here, but can be replaced with any external service. Keep in mind with example code you will likely always have to make *some* changes.

This example code can also be used as a starting point for other behaviors. With some modification, you can format data from other external systems and use that information to automate performance of actions within Arc.

Below will walk you through the steps to setup an external service and manage your Inbound Webhook.

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
  "key": "custom:sendtopipedream",
  "body": {
    "test": 123
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
_This assumes you have [created an integration](https://alc-swagger-template.s3.amazonaws.com/docs/swagger/index.html?url=ifx/admin/prod/swagger.json#operations-integrations-Create-a-new), [uploaded, deployed, and promoted](https://alc-swagger-template.s3.amazonaws.com/docs/swagger/index.html?url=ifx/admin/prod/swagger.json#operations-tag-bundles) your code to Sandbox._

### Create a custom event
`POST /ifx/api/v1/admin/events/custom`
```
{
  "eventName": "custom:sendtopipedream",
  "description": "Here is my description"
}
```

### Create a Webhook URL
`POST /ifx/api/v1/admin/events/custom/custom:sendtopipedream/webhooks`
```
{
  "description": "Here is a webhook"
}
```

### Subscribe the integration to the event
`POST /ifx/api/v1/admin/events/subscriptions`
```
{
  "eventName": "custom:sendtopipedream",
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

### Go to Pipedream
 See your POST request in your Workflow and its body being sent, indicating your integration was
 invoked successfully. If it posted, you're done!
