describe('User', function() {
  it('has functions', function() {
    expect(createUser).toBeDefined();
    expect(validateUser).toBeDefined();
  });

  describe('validation', function() {
    it('should return true for valid phone number, email, and password', function() {

    });
    it('should error on invalid phone number', function() {

    });
    it('should error on invalid password', function() {

    });
    it('should error on invalid email', function() {

    });
  });

  describe('createUser', function() {
    it('should create a valid user', function() {

    });
    it('should not create a user without a password', function() {

    });
    it('should not create a user without a email', function() {

    });
    it('should not create a user without a phone number', function() {

    });
  });

  describe('updateUser', function() {
    it('should update if new username is valid', function() {

    });
    it('should update if new password is valid', function() {

    });
    it('should update if new email is valid', function() {

    });
    it('should update if new phone number is valid', function() {

    });
  });

  describe('login', function() {

  });
});