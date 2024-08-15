- [x] Move to '@/api' for all api calls
    - [x] Split table views into multiple pages with links to each other
    - [x] Figure out why the handles of resizable boxes seemingly have a infinite z-index, despite only having a z-index of 10
    - [x] Make server components  
        > Partially done, working implementation for `/view/admin/quotes`
    - [x] Update editforms
        > Didn't do, they really need to be client components
- [x] Dashboard
    - [x] Associate Authors to profiles
    - [x] Remove @mui/x-chartx + @emotion
    - [x] Add charts.js react bindings 
    - [x] Collect Basic Statistics Per profile
    - [x] Display oldest quote
    - [x] Ask for more dashboard data suggestions.
- [x] Stats page
    - [x] Collect detailed statistics per author
    - [x] Collect detailed statistics per tag
- [x] Deploy to vercel
    - [x] Set up cron jobs for bot api
    - [x] Deploy git repo for vercel
    - [x] Test all features work
- [x] Move Whitelisted Users to DB Table
- [x] Add functionality: add users from admin panel
- [x] Add users to whitelist
- [x] Figure out what's wrong with the IDs of authors I add

## Bugfixes
- [ ] Refresh Does Not Work  
    - /view/admin/tags
- [ ] Editing Tags Does Not Work
    - /view/admin/tags
- [ ] Tag Editing Dialogue Labels 'Title' as 'Preamble'
    - /view/admin/tags
- [ ] `TypeError: Cannot read properties of undefined (reading 'id')`
    - /stats/authors
- [ ] Column Controls Re-Enable when selecting another filter controls while one is open
    - /view/admin/quotes
- [ ] Column Controls need to be disabled when selectiong filter controls
    - see /view/admin/quotes for implementation
## Features
- [x] Re-add table column hiding
- [ ] Automatically hide columns on mobile