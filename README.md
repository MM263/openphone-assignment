# OpenPhone assignment

## Setup

First we are going to set up our proxy

1. Clone `openphone-proxy` repo
2. `$ cd openphone-proxy` to get into the repo
3. `$ npm install` to install dependencies
4. Add your openphone api key into the `.env` file.
5. `$ npm run start`

Next, we are going to set up the frontend app itself:

1. Clone `openphone-assignment` into a separate repo
2. `$ cd openphone-assignment` to get into the repo
3. `$ npm install` to install dependencies
4. `$ npm run build` to build the output
5. `$ npm run preview` to start the server
6. `$ npm run dev` in case you need a dev setup with hot reloading

## Architecture

- Folder structure according to [Bulletproof React](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md).
- Routing handled by [TanStack Router](https://tanstack.com/router/latest). I'm assuming that you might have questions "why do you even need a router for a simple chat assignment?" - I saw that I can also fetch conversations and decided that it would be a good opportunity to experiment with this library as I was curious about.
  - Accordingly, conversations page is SSR using React Server Components, while chat itself is fully client-side.
  - TanStack also natively codesplits all of the routes to save on bundle size! I love to see something like this.
- [shadcn](https://ui.shadcn.com/) + tailwind for styling. Using it because it looks very modern and I'm familiar with tailwind so I can save some time on styling.

Improvements that I would go for if I wanted to spend more time:

- Rather than using the client directly everywhere, I'd rather use dependency injection for it.
- MSW to mock the network calls would simplify testing and allow for a more simple Storybook integration
- NOT use Tailwind - bigger teams, IMO, would benefit from more structure and less freedom in terms of what's possible. Something like Storybook + homegrown component library would do better for more robust projects
- Prettier to destroy bikeshedding once and for all.

## Assumptions / Trade-offs

- I couldn't figure out why the conversations endpoint returned conversations in arbitrary order. If there was one, I couldn't understand it and there were no sorting things I could pass to the API.
- I think, that in the OpenPhone app itself, you would have to use conversations in conjunction with contacts to get info about the user - I decided to forego this for the sake of saving some time.
- I would love to implement breadcrumbs, but I would have to restructure `<Outlet />` hierarchy to get them to work simply - probably some kind of `<Page />` abstraction would implement it reasonably well.
- Not a lot of tests, but at the same time, there's not a lot of business logic that would require validation. All of the optimistic merging logic came out to be not very readable due to a lot destructuring, so I decided that it's probably worth validating it somehow. Ideally, I would test all of the business logic like this and as for the functionality of the app itself - integration/E2E tests would be much more robust than unit tests.
