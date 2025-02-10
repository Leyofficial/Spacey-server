exports.createToken = () => {

  return import('crypto-random-string').then(({default: cryptoRandomString}) => {
    return  cryptoRandomString({length: 15, type: 'alphanumeric'});


  });
}