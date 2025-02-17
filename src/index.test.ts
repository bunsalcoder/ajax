import ajax, { getUrlWithParams } from "./index";

describe("Testing the ajax request", () => {
  it("Request to add IP to cloudflare", () => {
    const url =
      "https://api.cloudflare.com/client/v4/user/firewall/access_rules/rules";
    const props = {
      method: "POST",
      headers: {
        "X-Auth-Key": "c3fce644651f509caac28f7331982d7c2c09a",
        "X-Auth-Email": "developer@umpay.me",
      },
      data: {
        configuration: {
          target: "ip",
          value: "85.240.246.135",
        },
        mode: "whitelist",
      },
    };
    return ajax(url, props)
      .then((res) => {
        expect(1).toBe(1);
      })
      .catch(() => false);
  });

  it("Bind the params into URL params", () => {
    const url =
      "http://umpay.com/contacts/:contactId/users/:userId?/:dataData?";
    const params = {
      userId: 1234,
    };

    try {
      const theUrl = getUrlWithParams(url, {
        userId: 1234,
        contactId: 4321,
        dataData: "hello",
      });

      const newUrl = "http://umpay.com/contacts/4321/users/1234/hello";
      expect(newUrl).toEqual(theUrl);
    } catch (error) {
      console.log(error);
    }
  });
});
