import axios from 'axios';
import {Promise} from 'es6-promise';
import _ from 'lodash';

function serialize(obj, prefix) {
  let str = [];
  for(let p in obj) {
    if (obj.hasOwnProperty(p)) {
      let k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
      str.push(typeof v === "object" ?
        serialize(v, k) :
        encodeURIComponent(k) + "=" + encodeURIComponent(v));
    }
  }
  return str.join("&");
}

let ajax = {
  post(path, options) {
    return this.ajax('post', path, options);
  },

  get(path, options) {
    let qs = '';
    if(options && options.data){
      qs += `?${serialize(options.data)}`;
    }
    return this.ajax('get', path + qs, options);
  },

  put(path, options) {
    return this.ajax('put', path, options);
  },

  delete(path, options) {
    return this.ajax('delete', path, options);
  },

  ajax: function(method, path, options) {
    return new Promise((resolve, reject) => {
      let data = _.get(options, 'data', null);

      const { location } = window;

      const keyVal = location.pathname.split('/');
      keyVal.splice(0, 1);

      const routes = {};
      for(let i = 0; i < keyVal.length; i+=2){
        if(keyVal[i] && keyVal[i+1]) {
          routes[keyVal[i]] = keyVal[i+1];
        } else {
          routes[keyVal[i]] = true;
        }
      }

      data = { ...data, audit: routes };

      axios[method](path, data)
      .then((response) => {
        resolve(response.data);
      }).catch(response => {
        // console.log("Caught response, redirecting", response);
        if(response.status === 403) {
          window.user = null;
          window.location = `/#/login`;
        }

        reject(response.data);
      });
    });
  }
};

export default ajax;
