I have an idea for a new page on the web application.
Call it the "Storyboard"
The focus again, is for mobile users.

## Part 1
Part one of the idea is very simple.
*Take the plan of the TPN in to account: C:\source\repos\ThirdPartyNetwork\PLAN.md (un implemented, it is being implemented with a few minor changes, but the files should be up to date).*

1. Allow users to upload ALL of their photo's and video's.
	- All files will be stored in TPN
	- All files will be private from the start and author owned
	- All file ID's will be stored in the AtHomeServer backend
2. Users can then share them with the network. (Right after uploading them all, there should be a few options:
	- Keep all privated
	- Keep all private, except for these...
	- Share all to network
	- Share all, except for these...)
3. Authors can then add Tags to these images.
	- Tags can be any string
4. Not author users can suggest tags for images (Admins can always add tags)

Allow full file management:
- Permissions who can see the images (Public/Private/Users = Shared with current network/Private/Specific users)
- See where the images are used (See future parts of the suggestion doc)

## Part 2
### A
Part two allows users to make stories/collages of images.

They can do so with either only their images or mix it up with images from people who shared their image with the network (we'll call it "public images", but in code they are only public within the network).
Stories should be stored as a custom page in TPN so we can use it's sharing permission system. We can maybe use the page blocks for meta data, but maybe it would be better to keep all the data in the AtHomeServer's backend? (Q1)

With the TPN sharing, we can add editors to the story, so people can make stories together, meaning they will have multiple authors!

Adding some captions for images/videos makes stories more entertaining to read through.
Add the option to add a location to story. Add the option to images/videos to show their geo location if they have it.
You can also just add loose descriptions/captions to any files you author.

### B
Image lookups.
Giant image gallery.
Profile.
Stories

A page where you can look up view and look up images.
Add GOOD pagination. Image previews shouldn't be the best quality, you should be able to add a size query param to the image request (like 600x600) and the server will respond with such.
Clicking an image/video "Opens" it in a side bar on the right where you can see more details about the image, like: upload date, tags, author, captions, file size, x by y size, file type, etc...
You should be able to filter by author, tags, mediatype, and caption/description names.

A new stories page where you can see all the stories, sorted by date added.
Should be able to filter by author(s)/description/story name.

On the profile, you should be able to see a users stories. If public: show as normal, if shared with the user watching: it should indicated something like "Hidden, but not for you."
Add tabs, one for gym, one for stories, for the future for more features. When redirected from a the gym, it should first show the gym profile, of redirected from the storyboard.

There should also be a page section on the storyboard homepage "These people recently uploaded photo's" which takes you to a second type of storyboard profile page where you can see all the images the user has uploaded. If public: show as normal, if shared with the user watching: it should indicated something like "Hidden, but not for you."

Important!
Images and video's should only render when being close to being seen on the screen. (Something like when 50% distance under the screen viewport on desktop and 300% on phone).
Video's should never auto play. Only one video can play at once.
## Part 3 
Simple image editing.

- Simple color grading.
- Cutting the image
- Creating a new image from old images (combining into one)