import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import CreateRegistration from "../components/CreateRegistration.vue";
import UsersDataService from "../services/api-routes.users";

/**
 * Rewrite page title and metadata (head)
 *
 * **/

const setTitle = (to, from, next) => {
  // This goes through the matched routes from last to first, finding the closest route with a title.
  // e.g., if we have `/some/deep/nested/route` and `/some`, `/deep`, and `/nested` have titles,
  // `/nested`'s will be chosen.
  const nearestWithTitle = to.matched
    .slice()
    .reverse()
    .find((r) => r.meta && r.meta.title);

  // Find the nearest route element with meta tags.
  const nearestWithMeta = to.matched
    .slice()
    .reverse()
    .find((r) => r.meta && r.meta.metaTags);

  const previousNearestWithMeta = from.matched
    .slice()
    .reverse()
    .find((r) => r.meta && r.meta.metaTags);

  // If a route with a title was found, set the document (page) title to that value.
  if (nearestWithTitle) {
    document.title = nearestWithTitle.meta.title;
  } else if (previousNearestWithMeta) {
    document.title = previousNearestWithMeta.meta.title;
  }

  // Remove any stale meta tags from the document using the key attribute we set below.
  Array.from(document.querySelectorAll("[data-vue-router-controlled]")).map(
    (el) => el.parentNode.removeChild(el)
  );

  // Skip rendering meta tags if there are none.
  if (!nearestWithMeta) return next();

  // Turn the meta tag definitions into actual elements in the head.
  nearestWithMeta.meta.metaTags
    .map((tagDef) => {
      const tag = document.createElement("meta");

      Object.keys(tagDef).forEach((key) => {
        tag.setAttribute(key, tagDef[key]);
      });

      // We use this to track which meta tags we create so we don't interfere with other ones.
      tag.setAttribute("data-vue-router-controlled", "");

      return tag;
    })
    // Add the meta tags to the document head.
    .forEach((tag) => document.head.appendChild(tag));

  next();
};

/**
 * Authenticate user on all router calls.
 *
 * @src public
 */

const authenticate = async (to, from, next) => {
  const user = (await getUserData()) || {};
  if (
    !user.guid &&
    !user.username &&
    to.name !== "unauthorized" &&
    to.name !== "page-not-found"
  )
    return next({ path: "/401" });
  else {
    next();
  }
};

/**
 * Authorize user based on role.
 *
 * @src public
 */

const authorizeRegistrar = async (to, from, next) => {
  const { role = "" } = (await getUserData()) || {};
  if (
    ![
      "registrar",
      "nominator",
      "administrator",
      "super-administrator",
    ].includes(role)
  )
    return next({ name: "unauthorized" });
  else next();
};

const authorizeAdmin = async (to, from, next) => {
  const { role = "" } = (await getUserData()) || {};
  if (!["administrator", "super-administrator"].includes(role))
    return next({ name: "unauthorized" });
  else next();
};

const authorizeSuperAdmin = async (to, from, next) => {
  const { role = "" } = (await getUserData()) || {};
  if (!["super-administrator"].includes(role))
    return next({ name: "unauthorized" });
  else next();
};

/**
 * Retrieve user role for route authorization
 *
 * @src public
 */

const getUserData = async () => {
  const response = await UsersDataService.getUserInfo();
  const { data = {} } = response || {};
  return data;
};

/**
 * Set page title/metadata by route
 *
 * @src public
 * @param title
 */

function getMeta(title) {
  const sitename = "Premier's Awards: Event Registration";
  return {
    title: `${title} - ${sitename}`,
    metaTags: [
      {
        name: "icon",
        content: "favicon.ico",
      },
    ],
  };
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/guest",
      name: "guest",
      component: () => import("../views/AddGuestView.vue"),
    },
    {
      path: "/admin",
      name: "admin",
      component: () => import("../views/AdminView.vue"),
      beforeEnter: authorizeAdmin,
    },
    {
      path: "/create/registration",
      name: "financial-registration",
      component: CreateRegistration,
      meta: getMeta("Create Event Registration"),
      beforeEnter: authorizeRegistrar,
    },
    {
      path: "/edit/:id",
      name: "financial-registration-edit",
      component: () => import("../views/RegistrationView.vue"),
      meta: getMeta("Register Financial Details"),
      beforeEnter: authorizeRegistrar,
    },
    {
      path: "/admin/edit/:id",
      name: "admin-registration-edit",
      component: () => import("../views/RegistrationDetailsView.vue"),
      props: true,
      meta: getMeta("Edit Financial Details"),
      beforeEnter: authorizeAdmin,
    },
    // {
    //   path: "/401",
    //   name: "unauthorized",
    //   component: Unauthorized,
    //   meta: getMeta("Unauthorized"),
    // },
    // {
    //   path: "*",
    //   name: "page-not-found",
    //   component: NotFound,
    //   meta: getMeta("Page Not Found"),
    // },
  ],
});

// This callback runs before every route change, including on page load.
router.beforeEach(setTitle);
router.beforeResolve(authenticate);

export default router;
