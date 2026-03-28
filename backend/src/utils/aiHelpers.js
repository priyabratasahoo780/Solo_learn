/**
 * Static Expert Brain for SoloLearn platform.
 * Provides high-quality responses when the main Gemini AI is blocked by network issues.
 */
const getStaticResponse = (question) => {
  const lowerQ = question.toLowerCase();
  
  if (lowerQ.includes('js') || lowerQ.includes('javascript')) {
    return `**JavaScript Specialist (Offline Mode)**: JavaScript is the heartbeat of the web! 
    
Key concepts you should master:
- **Asynchronous JS**: Promises, Async/Await are crucial for APIs.
- **ES6+ Features**: Arrow functions, destructuring, and template literals.
- **Closures**: Functions bundled with their lexical environment.

How else can I help you with JS?`;
  }

  if (lowerQ.includes('react')) {
    return `**React Specialist (Offline Mode)**: React is a UI library based on components. 
    
Best practices:
- **Hooks**: Use \`useState\` and \`useEffect\` for logic.
- **Components**: Keep them small and reusable.
- **Props**: Pass data unidirectionally from parent to child.

Do you have a specific React question?`;
  }

  if (lowerQ.includes('node') || lowerQ.includes('express')) {
    return `**Backend Specialist (Offline Mode)**: Node.js lets you run JS on the server! 
    
Key Node topics:
- **Event Loop**: Understanding how non-blocking I/O works.
- **Middleware**: Express functions that handle request/response cycles.
- **Environment Variables**: Always store sensitive keys in \`.env\`.

Need help with a specific route or model?`;
  }

  if (lowerQ.includes('css')) {
    return `**Style Specialist (Offline Mode)**: CSS brings your app to life! 
    
Pro tips:
- **Flexbox**: Use \`display: flex\` for 1D layouts.
- **Grid**: Use \`display: grid\` for complex 2D layouts.
- **Glassmorphism**: Use \`backdrop-filter: blur(10px)\` for a premium look.

Want code for a specific layout?`;
  }

  // General Fallback
  return `**SoloLearn Expert (Offline Mode)**: I've detected a network block on the Gemini AI servers. 
  
I am currently operating as a **Local Specialist**. I am highly trained in JavaScript, React, CSS, and Backend development.

To restore my full "Generative Brain," please check your network or VPN settings for **generativelanguage.googleapis.com**.

How can I help you learn today?`;
};

module.exports = { getStaticResponse };
