

class BringApi {
    constructor(options) {
        this.mail = options.mail;
        this.password = options.password;
        this.url = options.url || `https://api.getbring.com/rest/v2/`;
        this.uuid = options.uuid || ``;
        this.headers = {
            'X-BRING-API-KEY': `cof4Nc6D8saplXjE3h3HXqHH8m7VU2i1Gs0g85Sp`,
            'X-BRING-CLIENT': `webApp`,
            'X-BRING-CLIENT-SOURCE': `webApp`,
            'X-BRING-COUNTRY': `DE`
        };
    }

    berechneFlaeche() {
        return this.height * this.width;
      }

    login() {
        let data;
        // Build headers
        let headerss = this.headers
        headerss[`Content-Type`] = `application/x-www-form-urlencoded`;


        try {
            data = axios.post(
                `${this.url}bringauth`,
                {
                    email: this.mail,
                    password: this.password
                },
                {
                    headers: headerss
                });
            
        }
        catch (e) {
            throw new Error(`Cannot Login: ${e.message}`);
        } // endCatch


        data = JSON.parse(data);
        this.name = data.name;
        this.uuid = data.uuid;
        this.bearerToken = data.access_token;
        this.refreshToken = data.refresh_token;
        this.headers[`X-BRING-USER-UUID`] = this.uuid;
        this.headers[`Authorization`] = `Bearer ${this.bearerToken}`;
        this.putHeaders = {
            ...this.headers,
            ...{ 'Content-Type': `application/x-www-form-urlencoded; charset=UTF-8` }
        };
        return this.uuid;
    }
  }


  window.bring = {
    BringApi: BringApi,
};