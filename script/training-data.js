
const trainingData = [
  {
    input: {
      title: '',
      urlTokens: 'mint intuit transaction event location',
    },
    output: 'play',
  },
  {
    input: {
      title: 'very-serious-bot · heroku-git | heroku',
      urlTokens: 'dashboard heroku apps very serious bot deploy heroku git',
    },
    output: 'work',
  },
  {
    input: { title: '', urlTokens: 'github fullstackacademy' },
    output: 'work',
  },
  {
    input: {
      title: 'kubla khan by samuel taylor coleridge | poetry foundation',
      urlTokens: 'poetryfoundation poems kubla khan',
    },
    output: 'play',
  },
  {
    input: {
      title: 'button alt text - google search',
      urlTokens: 'google search',
    },
    output: 'work',
  },
  {
    input: {
      title:
        'spirit airlines - cheap tickets, cheap flights, discount airfare, cheap hotels,cheap car rentals, cheap travel',
      urlTokens: 'save spirit airlines pub rf',
    },
    output: 'play',
  },
  {
    input: {
      title:
        'taskrabbit node-resque it s resque... for node! background jobs using redis.',
      urlTokens: 'github taskrabbit node resque',
    },
    output: 'work',
  },
  {
    input: {
      title: 'object prototypes - learn web development | mdn',
      urlTokens:
        'developer mozilla us docs learn javascript objects object_prototypes',
    },
    output: 'work',
  },
  {
    input: {
      title: 'react app',
      urlTokens: 'http localhost img campuses campus',
    },
    output: 'work',
  },
  {
    input: {
      title: '',
      urlTokens: 'learn fullstackacademy workshop content text',
    },
    output: 'work',
  },
  {
    input: {
      title: '',
      urlTokens: 'learn fullstackacademy assessment steps',
    },
    output: 'work',
  },
  {
    input: {
      title: 'são paulo - google maps',
      urlTokens: 'google maps place',
    },
    output: 'play',
  },
  {
    input: {
      title: '',
      urlTokens: 'learn fullstackacademy workshop landing',
    },
    output: 'work',
  },
  {
    input: {
      title: 's morgan st - google maps',
      urlTokens: 'google maps place ggpht tactile',
    },
    output: 'play',
  },
  {
    input: {
      title: 'outdated | npm documentation',
      urlTokens: 'docs npmjs cli outdated',
    },
    output: 'work',
  },
  {
    input: {
      title: 'solstice | built in chicago',
      urlTokens: 'builtinchicago company solstice',
    },
    output: 'work',
  },
  {
    input: {
      title:
        'comparing master...productcollection-component · dim-squad grace-shopper',
      urlTokens:
        'github dim squad grace shopper compare productcollection component',
    },
    output: 'work',
  },
  {
    input: {
      title: '',
      urlTokens: 'learn fullstackacademy workshop landing',
    },
    output: 'work',
  },
  {
    input: {
      title: 'billing management console',
      urlTokens: 'console aws amazon billing home',
    },
    output: 'work',
  },
  {
    input: {
      title: 'echo plus - google search',
      urlTokens: 'google search',
    },
    output: 'work',
  },
  {
    input: {
      title: 'the elm architecture · an introduction to elm',
      urlTokens: 'guide elm lang architecture',
    },
    output: 'work',
  },
  {
    input: {
      title: '',
      urlTokens: 'learn fullstackacademy workshop content text',
    },
    output: 'work',
  },
  {
    input: {
      title: '',
      urlTokens: 'learn fullstackacademy workshop content text',
    },
    output: 'work',
  },
  {
    input: { title: '', urlTokens: 'http localhost api users orders' },
    output: 'work',
  },
  {
    input: {
      title: 'array.prototype.filter() - javascript | mdn',
      urlTokens:
        'developer mozilla us docs web javascript reference global_objects array filter',
    },
    output: 'work',
  },
  {
    input: {
      title:
        'evancz elm-architecture-tutorial how to create modular elm code that scales nicely with your app',
      urlTokens: 'github evancz elm architecture tutorial',
    },
    output: 'work',
  },
  {
    input: {
      title: '( ) linkedin',
      urlTokens: 'linkedin mynetwork invite sent milica rodic',
    },
    output: 'work',
  },
  {
    input: {
      title: 'guake terminal improvement for multi-monitor setups',
      urlTokens:
        'schiessle articles guake terminal improvement for multi monitor setups',
    },
    output: 'work',
  },
  {
    input: {
      title:
        'container store promos, sales, deals & special savings | the container store',
      urlTokens: 'containerstore s clearance',
    },
    output: 'play',
  },
  {
    input: {
      title: 'fullstack academy',
      urlTokens: 'learn fullstackacademy workshop content text',
    },
    output: 'work',
  },
  {
    input: {
      title: '... pontevedra mobilidade ...',
      urlTokens: 'http pontevedra eu movete mobilidade natural a pe',
    },
    output: 'play',
  },
  {
    input: {
      title: 'slack api applications | mos for life slack',
      urlTokens: 'api slack apps aczbqf77c interactive messages',
    },
    output: 'work',
  },
  {
    input: {
      title: 'category bulgarian masculine given names - wikipedia',
      urlTokens: 'wikipedia wiki category',
    },
    output: 'play',
  },
  {
    input: {
      title: 'quotes – medium support',
      urlTokens: 'help medium hc us articles quotes',
    },
    output: 'work',
  },
  {
    input: {
      title: 'aws management console',
      urlTokens: 'console aws amazon lex home',
    },
    output: 'work',
  },
  {
    input: {
      title: 'change text of an element javascript - google search',
      urlTokens: 'google search',
    },
    output: 'work',
  },
  {
    input: {
      title: '',
      urlTokens: 'learn fullstackacademy workshop content text',
    },
    output: 'work',
  },
  {
    input: {
      title: 'lda model js - google search',
      urlTokens: 'google search',
    },
    output: 'work',
  },
  {
    input: {
      title: 'seating chart generator',
      urlTokens: 'fullstack chicago seating char herokuapp',
    },
    output: 'work',
  },
  {
    input: {
      title: 'internic - registrar list',
      urlTokens: 'internic net registrars registrar',
    },
    output: 'play',
  },
  {
    input: {
      title: 'beautiful resume for developer - google search',
      urlTokens: 'google search',
    },
    output: 'work',
  },
  {
    input: {
      title: '',
      urlTokens: 'learn fullstackacademy workshop content text',
    },
    output: 'work',
  },
  {
    input: {
      title: 'comparing master...reenable-auth- · dim-squad grace-shopper',
      urlTokens: 'github dim squad grace shopper compare reenable auth',
    },
    output: 'work',
  },
  {
    input: {
      title: 'capital one | bank details',
      urlTokens: 'myaccounts capitalone',
    },
    output: 'play',
  },
  {
    input: {
      title: 'pontevedra – airbnb',
      urlTokens: 'airbnb s pontevedra spain homes',
    },
    output: 'play',
  },
  {
    input: {
      title: 'a pomodoro timer for gnome',
      urlTokens: 'http gnomepomodoro',
    },
    output: 'work',
  },
  {
    input: {
      title: 'react dom render - google search',
      urlTokens: 'google search',
    },
    output: 'work',
  },
  {
    input: {
      title: 'pontevedra - google maps',
      urlTokens: 'google maps place pontevedra,+spain',
    },
    output: 'play',
  },
  {
    input: {
      title: 'pizzeria bebu reservations on resy',
      urlTokens: 'resy cities chi pizzeria bebu',
    },
    output: 'play',
  },
  {
    input: {
      title: 'the allis - google search',
      urlTokens: 'google search',
    },
    output: 'play',
  },
  {
    input: {
      title: 'semantic ui react && error - google search',
      urlTokens: 'google search',
    },
    output: 'work',
  },
  {
    input: {
      title: 'access rights validated',
      urlTokens: 'verified capitalone oigw init',
    },
    output: 'play',
  },
  {
    input: {
      title: 'seating chart generator',
      urlTokens: 'fullstack chicago seating char herokuapp',
    },
    output: 'work',
  },
  {
    input: {
      title: 'fullstack academy',
      urlTokens: 'learn fullstackacademy login',
    },
    output: 'work',
  },
  {
    input: {
      title: 'expressjs - visual studio marketplace',
      urlTokens: 'marketplace visualstudio items',
    },
    output: 'work',
  },
  {
    input: {
      title: 'ali zaidi | whitehouse.gov',
      urlTokens: 'obamawhitehouse archives gov blog author ali zaidi',
    },
    output: 'play',
  },
  {
    input: {
      title: 'chayote squash ( lb) from whole foods market - instacart',
      urlTokens: 'instacart whole foods products chayote squash lb',
    },
    output: 'play',
  },
  {
    input: {
      title: 'tensorflow.js',
      urlTokens: 'js tensorflow tutorials',
    },
    output: 'work',
  },
  {
    input: {
      title:
        'plugins fail to load when eslint is installed globally · issue · eslint eslint',
      urlTokens: 'github eslint eslint issues',
    },
    output: 'work',
  },
  {
    input: {
      title: 'cash back landing page',
      urlTokens: 'chaseloyalty chase home',
    },
    output: 'play',
  },
  {
    input: {
      title:
        'left and right hook bike crashes | bicycle law | keating law offices, p.c.',
      urlTokens: 'keatinglegal portfolio items left and right hooks',
    },
    output: 'play',
  },
  {
    input: {
      title: 'index of fontforge fontforge ubuntu',
      urlTokens: 'http ppa launchpad net fontforge fontforge ubuntu',
    },
    output: 'work',
  },
  {
    input: {
      title: '',
      urlTokens: 'learn fullstackacademy workshop content text',
    },
    output: 'play',
  },
  {
    input: {
      title: 'pizzeria bebu - google search',
      urlTokens: 'google search',
    },
    output: 'play',
  },
  {
    input: {
      title: '',
      urlTokens: 'learn fullstackacademy workshop content text',
    },
    output: 'work',
  },
  { input: { title: '', urlTokens: 'google maps place' }, output: 'play' },
  {
    input: {
      title: 'google sheets',
      urlTokens: 'docs google spreadsheets u',
    },
    output: 'work',
  },
  {
    input: {
      title: 'git commit -a -m - google search',
      urlTokens: 'google search',
    },
    output: 'work',
  },
  {
    input: {
      title: 'my daily travel household travel survey',
      urlTokens: 'mydailytravel webplaces placeswizard',
    },
    output: 'play',
  },
  {
    input: {
      title: 'linux command-line cheat sheet | computerworld',
      urlTokens:
        'computerworld article linux linux linux command line cheat sheet',
    },
    output: 'work',
  },
  {
    input: {
      title: 'sequelize createdat to integer - google search',
      urlTokens: 'google search',
    },
    output: 'work',
  },
  {
    input: {
      title: 'art',
      urlTokens: 'i love art herokuapp products category',
    },
    output: 'work',
  },
  {
    input: {
      title:
        'objects are not valid as a react child · issue · facebook react-native',
      urlTokens: 'github facebook react native issues',
    },
    output: 'work',
  },
  {
    input: {
      title: 'grace shopper',
      urlTokens: 'http localhost products',
    },
    output: 'work',
  },
  {
    input: {
      title: 'form - semantic ui react',
      urlTokens:
        'react semantic ui collections form field variations width field',
    },
    output: 'work',
  },
  {
    input: {
      title: 'pumping station one - google maps',
      urlTokens: 'google maps place pumping+station',
    },
    output: 'play',
  },
  {
    input: {
      title: 'sequelize findone - google search',
      urlTokens: 'google search',
    },
    output: 'work',
  },
  {
    input: {
      title: 'localhost',
      urlTokens: 'http localhost api users orders',
    },
    output: 'work',
  },
  {
    input: {
      title: 'organization profile',
      urlTokens: 'github organizations wirehead extension settings profile',
    },
    output: 'work',
  },
  {
    input: { title: '', urlTokens: 'http localhost students' },
    output: 'work',
  },
  {
    input: {
      title: 'plugins · babel',
      urlTokens: 'babeljs io docs plugins',
    },
    output: 'work',
  },
  {
    input: {
      title: 'merge branc into master - google search',
      urlTokens: 'google search',
    },
    output: 'work',
  },
  {
    input: { title: 'rj grunts', urlTokens: 'http rjgruntschicago' },
    output: 'play',
  },
  {
    input: {
      title:
        'big-o algorithm complexity cheat sheet (know thy complexities!) ericdrowell',
      urlTokens: 'http bigocheatsheet',
    },
    output: 'work',
  },
  {
    input: {
      title: '',
      urlTokens: 'learn fullstackacademy workshop content text',
    },
    output: 'work',
  },
  {
    input: {
      title: 'siri uotile - google search',
      urlTokens: 'google search',
    },
    output: 'play',
  },
  {
    input: {
      title: 'application-only authentication — twitter developers',
      urlTokens:
        'developer twitter docs basics authentication overview application only',
    },
    output: 'work',
  },
  {
    input: {
      title: '',
      urlTokens: 'learn fullstackacademy workshop content text',
    },
    output: 'work',
  },
  {
    input: {
      title: '- javascript function onhover in div - stack overflow',
      urlTokens: 'stackoverflow questions javascript function onhover in div',
    },
    output: 'work',
  },
  {
    input: {
      title:
        'visual studio code - how to disable typescript warnings in vscode - stack overflow',
      urlTokens:
        'stackoverflow questions how to disable typescript warnings in vscode',
    },
    output: 'work',
  },
  {
    input: {
      title: 'react elm components - google search',
      urlTokens: 'google search',
    },
    output: 'work',
  },
  {
    input: {
      title: 'redux persist statereconciler - google search',
      urlTokens: 'google search',
    },
    output: 'work',
  },
  {
    input: {
      title: 'td size property - google search',
      urlTokens: 'google search',
    },
    output: 'work',
  },
  {
    input: {
      title: 'step add the lambda function as a code hook - amazon lex',
      urlTokens: 'docs aws amazon lex latest dg ex book trip create integrate',
    },
    output: 'work',
  },
  {
    input: {
      title: 'log into facebook | facebook',
      urlTokens: 'facebook login device based regular login',
    },
    output: 'play',
  },
  {
    input: {
      title: 'welcome to divvy!',
      urlTokens: 'member divvybikes account activate_bike_key',
    },
    output: 'play',
  },
  {
    input: {
      title: 'sequelize vs knex.js comparison | stackshare',
      urlTokens: 'stackshare io stackups knex js vs sequelize',
    },
    output: 'work',
  },
  {
    input: {
      title: '(fixed) fatal ident authentication failed for user postgres',
      urlTokens:
        'tecadmin net fatal ident authentication failed for user postgres',
    },
    output: 'work',
  },
  {
    input: {
      title: 'firebase console',
      urlTokens: 'console firebase google project fir demo project overview',
    },
    output: 'work',
  },
  {
    input: {
      title: 'object.prototype - javascript | mdn',
      urlTokens:
        'developer mozilla us docs web javascript reference global_objects object prototype',
    },
    output: 'work',
  },
  {
    input: {
      title:
        'tutorial | sequelize | the node.js orm for postgresql, mysql, sqlite and mssql',
      urlTokens: 'http docs sequelizejs manual tutorial models usage',
    },
    output: 'work',
  },
  {
    input: {
      title:
        'npm start fails eaddrinuse (solution) · issue · stephengrider reduxsimplestarter',
      urlTokens: 'github stephengrider reduxsimplestarter issues',
    },
    output: 'work',
  },
  {
    input: {
      title: 'listener for choosing option in select tag - google search',
      urlTokens: 'google search',
    },
    output: 'work',
  },
  { input: { title: '', urlTokens: 'google maps place' }, output: 'play' },
  {
    input: {
      title:
        'mhi-academy-of-js app at master · dustinheestand mhi-academy-of-js',
      urlTokens: 'github dustinheestand mhi academy of js tree master app',
    },
    output: 'work',
  },
  {
    input: {
      title: 'ryazhenka - google search',
      urlTokens: 'google search',
    },
    output: 'play',
  },
  {
    input: {
      title:
        'left and right hook bike crashes | bicycle law | keating law offices, p.c.',
      urlTokens: 'keatinglegal portfolio items left and right hooks',
    },
    output: 'play',
  },
  {
    input: {
      title: 'madrid, spain to pontevedra, spain - google maps',
      urlTokens: 'google maps dir madrid,+spain pontevedra,+spain am=t',
    },
    output: 'play',
  },
  {
    input: {
      title: 'grace shopper',
      urlTokens: 'http localhost products',
    },
    output: 'work',
  },
  {
    input: {
      title: 'tryit editor v .',
      urlTokens: 'w3schools tryit asp',
    },
    output: 'work',
  },
  {
    input: {
      title: '',
      urlTokens: 'learn fullstackacademy workshop content text',
    },
    output: 'work',
  },
  {
    input: {
      title: 'dim-squad grace-shopper | waffle.io',
      urlTokens: 'waffle io dim squad grace shopper',
    },
    output: 'work',
  },
  {
    input: {
      title: 'adding a new ssh key to your github account - user documentation',
      urlTokens:
        'help github articles adding a new ssh key to your github account',
    },
    output: 'work',
  },
  {
    input: {
      title: 'your location to music box theatre - google maps',
      urlTokens: 'google maps dir',
    },
    output: 'play',
  },
  {
    input: {
      title: '',
      urlTokens: 'help twitter twitter for websites ads info and privacy',
    },
    output: 'work',
  },
  {
    input: {
      title: '',
      urlTokens: 'learn fullstackacademy workshop content text',
    },
    output: 'work',
  },
  {
    input: {
      title: '',
      urlTokens: 'learn fullstackacademy workshop content text',
    },
    output: 'work',
  },
  {
    input: {
      title: '',
      urlTokens: 'learn fullstackacademy workshop content text',
    },
    output: 'work',
  },
  {
    input: {
      title:
        'grace-shopper productdetail.js at post-reviews- · dim-squad grace-shopper',
      urlTokens:
        'github dim squad grace shopper blob post reviews client components productdetail js',
    },
    output: 'work',
  },
  {
    input: {
      title: 'step add the lambda function as a code hook - amazon lex',
      urlTokens: 'docs aws amazon lex latest dg ex book trip create integrate',
    },
    output: 'work',
  },
  {
    input: {
      title: 'pottery barn',
      urlTokens: 'form potterybarn ats show aspx',
    },
    output: 'play',
  },
  {
    input: {
      title:
        'chez moi - home - chicago, illinois - menu, prices, restaurant reviews | facebook',
      urlTokens: 'facebook chez moi',
    },
    output: 'play',
  },
  {
    input: {
      title: 'iam management console',
      urlTokens: 'console aws amazon iam home security_credential',
    },
    output: 'work',
  },
  {
    input: {
      title: '',
      urlTokens: 'http react semantic ui maximize grid example container',
    },
    output: 'work',
  },
  {
    input: {
      title: 'yarn run - google search',
      urlTokens: 'google search',
    },
    output: 'work',
  },
  {
    input: {
      title: 'htmlaudioelement - web apis | mdn',
      urlTokens: 'developer mozilla us docs web api htmlaudioelement',
    },
    output: 'work',
  },
  {
    input: { title: 'timeline', urlTokens: 'google maps timeline' },
    output: 'play',
  },
  {
    input: {
      title: 'google docs - create and edit documents online, for free.',
      urlTokens: 'accounts google signin v2 sl pwd',
    },
    output: 'work',
  },
  {
    input: {
      title: 'js alphabetical sort - google search',
      urlTokens: 'google search',
    },
    output: 'work',
  },
  {
    input: {
      title:
        '-fsa-ch-library -junior-phase -css at master · fullstackacademy -fsa-ch-library',
      urlTokens:
        'github fullstackacademy fsa ch library tree master junior phase css',
    },
    output: 'work',
  },
  {
    input: {
      title: 'cheburashka - google search',
      urlTokens: 'google search',
    },
    output: 'play',
  },
  {
    input: {
      title: '',
      urlTokens: 'learn fullstackacademy workshop content text',
    },
    output: 'work',
  },
  {
    input: {
      title: 'my daily travel',
      urlTokens: 'mydailytravel websurvey survey aspx',
    },
    output: 'play',
  },
  {
    input: {
      title: 'git commit -a -m - google search',
      urlTokens: 'google search',
    },
    output: 'work',
  },
  {
    input: {
      title: 'dustin heestand - google docs',
      urlTokens: 'docs google document d edit',
    },
    output: 'work',
  },
  {
    input: { title: '', urlTokens: 'codewars kata train javascript' },
    output: 'work',
  },
  {
    input: {
      title: 'nodemon eaddrinuse - google search',
      urlTokens: 'google search',
    },
    output: 'work',
  },
  {
    input: {
      title: 'flexbox - google search',
      urlTokens: 'google search',
    },
    output: 'work',
  },
  {
    input: {
      title: 'botkit studio by howdy',
      urlTokens: 'studio botkit ai app new',
    },
    output: 'work',
  },
  {
    input: {
      title: 'capital one – multi-factor authentication request',
      urlTokens: 'verified capitalone challenge',
    },
    output: 'play',
  },
  { input: { title: '', urlTokens: 'google maps dir' }, output: 'play' },
  {
    input: {
      title: 'getting started guide | clarifai developer',
      urlTokens: 'clarifai developer guide public models public models',
    },
    output: 'work',
  },
  {
    input: {
      title: '',
      urlTokens: 'react semantic ui elements button states active',
    },
    output: 'work',
  },
  {
    input: {
      title: '',
      urlTokens:
        'docs docker engine installation linux docker ce ubuntu uninstall docker ce',
    },
    output: 'work',
  },
  {
    input: {
      title: 'eslint plugin re - google search',
      urlTokens: 'google search',
    },
    output: 'work',
  },
  {
    input: {
      title:
        'sequelize | sequelize | the node.js orm for postgresql, mysql, sqlite and mssql api document',
      urlTokens: 'http docs sequelizejs class lib sequelize js~sequelize',
    },
    output: 'work',
  },
  { input: { title: '', urlTokens: 'google maps place' }, output: 'play' },
  {
    input: {
      title:
        'the a’s changed baseball once. they may be changing it again. | fivethirtyeight',
      urlTokens:
        'fivethirtyeight features the as changed baseball once they may be changing it again',
    },
    output: 'play',
  },
  {
    input: {
      title: 'create profile | built in chicago',
      urlTokens: 'builtinchicago user profile',
    },
    output: 'work',
  },
];

trainingData.forEach(datum => {
  let string = datum.input.title + datum.input.urlTokens;
  let classification = datum.output;
  classifier.addDocument(string, classification);
});

classifier.train();

console.log(
  classifier.classify('madrid, spain to pontevedra, spain - google maps')
);

classifier.save('classifier.json', function(err, classifier) {
the classifier is saved to the classifier.json file!
});
