Email Templates
===

These Email Templates are for Mandrill / Mailchimp API.  

You will want to create both Email and Text based emails using the name of the folder as the template key name.

This API will connect to you Mandrill using the API Key and look for the correct template to use based on the names in this folder.

Update Templates
---

You will want to look through all the `.html` & `.txt` files and replace the following:

* `mywebsite.com` - Replace this with your actual website
* `support@mywebsite.zendesk.com` - Replace this with whatever your actual support email is
* `@mytwitter` - Replace this with your Twitter Username
* `https://twitter.com/mytwitter` - Replace this with your Twitter URL
* `https://mywebsite.com/unsubscribed` - Replace this with your custom page for when a user Unsubscribes

Email Images
---

You will want to upload these to a CDN like Amazons S3 bucket.  Then update the `.html` files to point to wherever you installed them.  There are two images:

* `https://s3.amazonaws.com/mybucket/email-images/logo.png` - This is the `./email-images/logo.png` Logo at the top of the Email
* `https://s3.amazonaws.com/mybucket/email-images/shadow-space.png` - This image `./0email-images/shadow-space.png` separates the footer from the content