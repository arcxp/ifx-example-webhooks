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

## Running the integration
run `npm i`

run `npm run localTestingServer`

## Send Post
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

## Return
You should see a return from your post as "we did it!"
and in your console log
```
{ test: 123, other: true }
------------response
hello world!
we did it!
```