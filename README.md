
## Building your integration

### Prerequisites


1. Create a personal access token with `read:package` scope in your GitHub account. See ["Creating a personal access token."](https://docs.github.com/en/enterprise-server@3.4/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)

2. Once a PAT is created, there are two ways to install the Node.js SDK dependency. The first option is to create your local .npmrc file directly. Another option is to use npm login command.

    - Create your local .npmrc file directly
      ```
      export GITHUB_TOKEN=<your PAT generated through the GitHub console>
      npm config set @arcxp:registry=https://npm.pkg.github.com/
      echo '//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}' >> ~/.npmrc
      ```
    - Use `npm login`
      ```
      npm login --scope=@arcxp --auth-type=legacy --registry=https://npm.pkg.github.com
     
      Username: your GitHub username
      Password: your PAT generated through the GitHub console
      Email: your GitHub email
      ```

### Installation


1. Install NPM packages
   ```
   npm install
   ```
2. Optional: Reset NPM configuration
   ```
   npm config delete @arcxp:registry
   npm logout --registry=https://npm.pkg.github.com/
   ```


## Running your Integration

If all succeeded, then you can run:
```
npm run localTestingServer
```


## Configuration


### Environment Files

Utilize the `.env.{my-environment}` files in the root directory to provide environment specific
configuration to your application. Do not store secrets or api keys in these files, for those see [Secrets](#secrets)


### Secrets
Secrets are managed via the Arc Admin API. Secrets that you add to your integration via that API get placed as environment variables available to your application on the `process.env` object.

To test secrets while running the local development server, you should create a file called `.env` in
the root directory of your project and store them there. **Note: This file containing secrets should NOT be committed to version control.**

## Moving your Integration from local to IFX
With 2.0, IFX has moved to the PageBuilder model where code is zipped, uploaded, deployed, and promoted.

A nominal deploy process looks as follows:

     │ Bundle ├───────►│ Upload ├──────►│ Deploy ├─────►│ Promote │

We go into more detail on our 2.0 landing page in ALC: https://docs.arcxp.com/alc/en/welcome-to-the-ifx-2-0-world?sys_kb_id=86e2bb7a8759b110637f315d0ebb3592&id=kb_article_view&sysparm_rank=1&sysparm_tsqueryId=ea18b7fe8759b110637f315d0ebb350a

Node.js Specific bundling detail is discussed in ALC here: https://docs.arcxp.com/alc/en/bundle-deployment-workflow-2-0-only?id=kb_article_view&sys_kb_id=1634b3fa8759b110637f315d0ebb35a8&spa=1#mcetoc_1haaaajev29

### Bundling your code
Once your code is tested locally, it can be bundled into a zip file for uploading to IFX.
```
npm run build
npm run zip
```

### Uploading your bundle
After bundling, upload your bundle to IFX.
```
curl -X POST \
 --location 'https://api.{:org}.arcpublishing.com/ifx/api/v1/admin/bundles/:integrationName' \
 --header 'Authorization: Bearer ' \
 -F 'name=myIntegration-1-1-0' \
 -F 'bundle=@/path/to/zip/myIntegration.zip;type=application/zip'
```

### Deploying your bundle
Once your zip is uploaded, it must be deployed into the IFX framework.  This is a discrete step from uploading, as some uploaded bundles may not need to be used or are immediately replaced.
```
POST /ifx/api/v1/admin/bundles/{integrationName}/deploy/{bundleName}
```

### Promoting your bundle
After deploying, your code will be ready to handle invocations, but it is not yet set to be used by default (referred to as being "live").  Promoting your bundle will set it to be the "live" version of your integration that will be invoked.
```
POST /ifx/api/v1/admin/bundles/{integrationName}/promote/{version}
```