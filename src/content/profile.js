/**
 * Identity and contact details for the homepage, resume and footer.
 *
 * Content lives in src/content/ rather than inside components so copy can be
 * edited without touching JSX, and so the homepage and the resume page render
 * from a single source instead of drifting apart.
 */

export const PROFILE = {
  name: 'Aaron Diefes',

  /* The page H1. Recruiters scan for the role before the name, so the role is
     the heading and the name is the header wordmark. */
  role: 'Systems and graphics engineer',

  /* First person is standard practice for the bio. Project descriptions stay
     neutral third person - see src/content/projects.js. */
  bio: 'I build the layers most software sits on. Recent work: a 2D rendering engine written in C++ and compiled to WebAssembly, a pipelined 32-bit CPU in Verilog, and the algorithms that make both of them fast.',

  email: 'awdiefes@gmail.com',
  github: 'https://github.com/AaronDiefes',
  githubLabel: 'github.com/AaronDiefes',

  /* Not yet supplied. Rendered only when set - never ship a link that 404s. */
  linkedin: null,

  /* Path to the PDF once it exists in public/resume/. While null, the resume
     call-to-action is omitted rather than pointing at a missing file. */
  resumePdf: null,

  updated: 'August 2026',

  /* Every figure here is verifiable in this repository: 7 CPU + 6 graphics + 4
     Uber documentation pages, and two routes that run live in the browser. */
  proof: [
    { value: '3', label: 'systems projects' },
    { value: '17', label: 'documentation pages' },
    { value: '2', label: 'live in-browser demos' },
  ],

  stack: 'C++ · Verilog · Python · WebAssembly',
}

export default PROFILE
