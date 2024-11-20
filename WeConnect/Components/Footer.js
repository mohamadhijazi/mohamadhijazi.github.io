// Register the `hello` component
vueapp.component('FooterCompenent', {
    data: () => ({
      year: (new Date()).getFullYear()
    }),
    template: `
      <div>        
        <h3>Copy rights @, {{year}}</h3>
      </div>
    `
  });