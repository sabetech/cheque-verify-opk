const LaravelAuthProvider = {
    isAuthenticated: false,

    signin(callback: VoidFunction) {
      callback();
      LaravelAuthProvider.isAuthenticated = true;
    },
    signout(callback: VoidFunction) {
      LaravelAuthProvider.isAuthenticated = false;
      setTimeout(callback, 100);
    },
  };
  
  export { LaravelAuthProvider };