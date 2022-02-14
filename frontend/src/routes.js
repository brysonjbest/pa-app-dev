/*!
 * Routes (Vue)
 * File: routes.js
 * Copyright(c) 2022 BC Gov
 * MIT Licensed
 */

import VueRouter from 'vue-router'
import Home from  '@/components/views/Home'
import NotFound from '@/components/views/404'
import Unauthorized from '@/components/views/401'
import EditUser from '@/components/views/EditUser'
import DeleteUser from '@/components/views/DeleteUser'
import ManageNominations from '@/components/views/ManageNominations'
import ListUsers from '@/components/views/ManageUsers'
import ListNominations from '@/components/views/ListNominations'
import NominationEmergingLeader from '@/components/views/NominationEmergingLeader'
import NominationEvidenceDesign from '@/components/views/NominationEvidenceDesign'
import NominationInnovation from '@/components/views/NominationInnovation'
import NominationLeadership from '@/components/views/NominationLeadership'
import NominationLegacy from '@/components/views/NominationLegacy'
import NominationOrgLeadership from '@/components/views/NominationOrgExcellence'
import NominationPartnership from '@/components/views/NominationPartnership'
import NominationRegionalImpact from '@/components/views/NominationRegionalImpact'
import ViewNomination from '@/components/views/ViewNomination'
import DeleteNomination from '@/components/views/DeleteNomination'
import CreateNomination from '@/components/views/CreateNomination'
import AssignUser from '@/components/views/AssignUser'
import api from '@/services/api.services'


/**
 * Rewrite page title and metadata (head)
 *
 * **/

const setTitle = (to, from, next) => {
  // This goes through the matched routes from last to first, finding the closest route with a title.
  // e.g., if we have `/some/deep/nested/route` and `/some`, `/deep`, and `/nested` have titles,
  // `/nested`'s will be chosen.
  const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title);

  // Find the nearest route element with meta tags.
  const nearestWithMeta = to.matched.slice().reverse().find(r => r.meta && r.meta.metaTags);

  const previousNearestWithMeta = from.matched.slice().reverse().find(r => r.meta && r.meta.metaTags);

  // If a route with a title was found, set the document (page) title to that value.
  if (nearestWithTitle) {
    document.title = nearestWithTitle.meta.title;
  } else if (previousNearestWithMeta) {
    document.title = previousNearestWithMeta.meta.title;
  }

  // Remove any stale meta tags from the document using the key attribute we set below.
  Array.from(document.querySelectorAll('[data-vue-router-controlled]')).map(el => el.parentNode.removeChild(el));

  // Skip rendering meta tags if there are none.
  if (!nearestWithMeta) return next();

  // Turn the meta tag definitions into actual elements in the head.
  nearestWithMeta.meta.metaTags.map(tagDef => {
    const tag = document.createElement('meta');

    Object.keys(tagDef).forEach(key => {
      tag.setAttribute(key, tagDef[key]);
    });

    // We use this to track which meta tags we create so we don't interfere with other ones.
    tag.setAttribute('data-vue-router-controlled', '');

    return tag;
  })
    // Add the meta tags to the document head.
    .forEach(tag => document.head.appendChild(tag));

  next();
}

/**
 * Authenticate user on all router calls.
 *
 * @src public
 */

const authenticate = async (to, from, next) => {
  const user = await getUserData() || {};
  if ( !user.guid
    && !user.username
    && to.name !== 'unauthorized'
    && to.name !== 'page-not-found'
  ) return next({path: '/401'})
  else next()
}

/**
 * Authorize user based on role.
 *
 * @src public
 */

const authorizeNominator = async (to, from, next) => {
  const {role=''} = await getUserData() || {};
  if (!['nominator', 'administrator', 'super-administrator'].includes(role))
    return next({name: 'unauthorized'})
  else next()
}

const authorizeAdmin = async (to, from, next) => {
  const {role=''}  = await getUserData() || {};
  if (!['administrator', 'super-administrator'].includes(role))
    return next({name: 'unauthorized'})
  else next()
}

const authorizeSuperAdmin = async (to, from, next) => {
  const {role=''}  = await getUserData() || {};
  if (!['super-administrator'].includes(role))
    return next({name: 'unauthorized'})
  else next()
}

/**
 * Retrieve user role for route authorization
 *
 * @src public
 */

const getUserData = async () => {
  const response = await api.get(`users/info`);
  const {data = {}} = response || {}
  return data
}


/**
 * Set page title/metadata by route
 *
 * @src public
 * @param title
 */

function getMeta(title) {
  const sitename = 'Premier\'s Awards: Nominations';
  return {
    title: `${title} - ${sitename}`,
    metaTags: [
      {
        name: 'icon',
        content: 'favicon.ico'
      },
    ]
  }
}

/**
 * Route definitions (Vue)
 *
 * @src public
 */

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
    meta: getMeta('Home')
  },
  {
    path: "/register",
    name: "admin-user-register",
    component: EditUser,
    meta: getMeta('Nominator Registration')
  },
  {
    path: "/admin/user/edit/:guid",
    name: "admin-user-edit",
    component: EditUser,
    meta: getMeta('Edit User Data'),
    beforeEnter: authorizeAdmin
  },
  {
    path: "/admin/user/assign/:guid",
    name: "admin-user-assign",
    component: AssignUser,
    meta: getMeta('Assign User Role'),
    beforeEnter: authorizeSuperAdmin
  },
  {
    path: "/admin/user/list",
    name: "admin-user-list",
    component: ListUsers,
    meta: getMeta('Manage Users'),
    beforeEnter: authorizeAdmin
  },
  {
    path: "/admin/user/delete/:guid",
    name: "admin-user-delete",
    component: DeleteUser,
    meta: getMeta('Delete User'),
    beforeEnter: authorizeAdmin
  },
  {
    path: "/admin/list",
    name: "nominations-administration",
    component: ManageNominations,
    meta: getMeta('Manage Nominations'),
    beforeEnter: authorizeAdmin
  },
  {
    path: "/list",
    name: "nomination-list",
    component: ListNominations,
    props: {
      header: 'My Nominations',
      lead: 'View Your Saved Nominations'
    },
    meta: getMeta('My Nominations'),
    beforeEnter: authorizeNominator
  },
  {
    path: "/view/:id",
    name: "nomination-view",
    component: ViewNomination,
    meta: getMeta('View Nomination'),
    beforeEnter: authorizeNominator
  },
  {
    path: "/delete/:id",
    name: "nomination-delete",
    component: DeleteNomination,
    meta: getMeta('Delete Nomination'),
    beforeEnter: authorizeNominator
  },
  {
    path: "/create/:year/emerging-leader",
    name: "emerging-leader",
    component: CreateNomination,
    meta: getMeta('Emerging Leader'),
    beforeEnter: authorizeNominator
  },
  {
    path: "/create/:year/evidence-based-design",
    name: "evidence-based-design",
    component: CreateNomination,
    meta: getMeta('Evidence-Based Design'),
    beforeEnter: authorizeNominator
  },
  {
    path: "/create/:year/leadership",
    name: "leadership",
    component: CreateNomination,
    meta: getMeta('Leadership'),
    beforeEnter: authorizeNominator
  },
  {
    path: "/create/:year/legacy",
    name: "legacy",
    component: CreateNomination,
    meta: getMeta('Legacy'),
    beforeEnter: authorizeNominator
  },
  {
    path: "/create/:year/innovation",
    name: "innovation",
    component: CreateNomination,
    meta: getMeta('Innovation'),
    beforeEnter: authorizeNominator
  },
  {
    path: "/create/:year/organizational-excellence",
    name: "organizational-excellence",
    component: CreateNomination,
    meta: getMeta('Organizational Excellence'),
    beforeEnter: authorizeNominator
  },
  {
    path: "/create/:year/partnership",
    name: "partnership",
    component: CreateNomination,
    meta: getMeta('Partnership'),
    beforeEnter: authorizeNominator
  },
  {
    path: "/create/:year/regional-impact",
    name: "regional-impact",
    component: CreateNomination,
    meta: getMeta('Regional Impact'),
    beforeEnter: authorizeNominator
  },
  {
    path: "/edit/:year/emerging-leader/:id",
    name: "emerging-leader-edit",
    component: NominationEmergingLeader,
    meta: getMeta('Emerging Leader'),
    beforeEnter: authorizeNominator
  },
  {
    path: "/edit/:year/evidence-based-design/:id",
    name: "evidence-based-design-edit",
    component: NominationEvidenceDesign,
    meta: getMeta('Evidence-Based Design'),
    beforeEnter: authorizeNominator
  },
  {
    path: "/edit/:year/leadership/:id",
    name: "leadership-edit",
    component: NominationLeadership,
    meta: getMeta('Leadership'),
    beforeEnter: authorizeNominator
  },
  {
    path: "/edit/:year/legacy/:id",
    name: "legacy-edit",
    component: NominationLegacy,
    meta: getMeta('Legacy'),
    beforeEnter: authorizeNominator
  },
  {
    path: "/edit/:year/innovation/:id",
    name: "innovation-edit",
    component: NominationInnovation,
    meta: getMeta('Innovation'),
    beforeEnter: authorizeNominator
  },
  {
    path: "/edit/:year/organizational-excellence/:id",
    name: "organizational-excellence-edit",
    component: NominationOrgLeadership,
    meta: getMeta('Organizational Excellence'),
    beforeEnter: authorizeNominator
  },
  {
    path: "/edit/:year/partnership/:id",
    name: "partnership-edit",
    component: NominationPartnership,
    meta: getMeta('Partnership'),
    beforeEnter: authorizeNominator
  },
  {
    path: "/edit/:year/regional-impact/:id",
    name: "regional-impact-edit",
    component: NominationRegionalImpact,
    meta: getMeta('Regional Impact'),
    beforeEnter: authorizeNominator
  },
  {
    path: '/401',
    name: 'unauthorized',
    component: Unauthorized,
    meta: getMeta('Unauthorized')
  },
  {
    path: '*',
    name: "page-not-found",
    component: NotFound ,
    meta: getMeta('Page Not Found')
  }
];

const router = new VueRouter({
  base: '/nominations',
  mode: 'history',
  routes: routes
})

// This callback runs before every route change, including on page load.
router.beforeEach(setTitle);
router.beforeResolve(authenticate);

export default router
