class ValidatorHelper {
  public isBoolean(value: any): boolean {
    try {
      if (typeof value === 'boolean') {
        return true;
      }

      if (typeof value === 'string') {
        if (value.toLowerCase() === 'false' || value.toLowerCase() === 'true') {
          return true;
        }
        if (value === '0' || value === '1') {
          return true;
        }
      }

      if (typeof value === 'number' && (value === 0 || value === 1)) {
        return true;
      }

      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  public isValidString(str: any, len: number): any {
    if (this.isNullOrUndefined(str)) return false;
    if (!str || str.trim().length === 0 || typeof str !== 'string')
      return false;
    if (len && str.trim().length < len) return false;
    return true;
  }

  public isAlphaNum(pValue: any): any {
    const exp = /^([a-zA-Z0-9 _-]+)$/;
    if (exp.test(pValue)) {
      return true;
    }
    return false;
  }

  public isNotUndefinedAndNull(pValue: any): any {
    let value = pValue;
    if (typeof value === 'string') {
      value = pValue.trim();
    }
    if (
      value !== undefined &&
      value !== null &&
      value !== '' &&
      value !== 'null' &&
      value !== 'undefined'
    ) {
      return true;
    }
    return false;
  }

  public isNullOrUndefined(pValue): any {
    if (
      pValue === undefined ||
      pValue === null ||
      (typeof pValue === 'string' && pValue.trim() === '') ||
      pValue === 'null' ||
      pValue === 'undefined'
    ) {
      return true;
    }
    return false;
  }

  public isOnlyNumber(pValue) {
    const exp = /^\d+$/;
    if (exp.test(pValue)) {
      return true;
    }
    return false;
  }
  public isValidEmail(pValue: string): boolean {
    if (
      pValue === undefined ||
      pValue === null ||
      (typeof pValue === 'string' && pValue.trim() === '') ||
      pValue === 'null' ||
      pValue === 'undefined'
    ) {
      return false;
    }
    if (pValue) {
      const re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(pValue).toLowerCase());
    }
    return true;
  }
}

export default new ValidatorHelper();
