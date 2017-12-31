/*
|-------------------------------------------------------------------------------
| TODO {Abdelghafour}: Error handling
|-------------------------------------------------------------------------------
| should we throw error if the class is constructed with undefined values
| maybe using proxies from es6
|-------------------------------------------------------------------------------
*/
class StandardNotification {
  constructor(type, payload = {}, meta = {}) {
    this.type = type;
    this.payload = payload;
    this.meta = meta;
  }

  getType() {
    return this.type;
  }
}

module.exports = StandardNotification;
