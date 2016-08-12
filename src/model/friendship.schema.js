const Friendship = function(userRequested, userRequester, blockUserRequested, blockUserRequester) {
    this.status = 0;
    this.userRequested = userRequested;
    this.userRequester = userRequester;
    this.blockUserRequested = blockUserRequested;
    this.blockUserRequester = blockUserRequester;
};

Friendship.statusType = {
  NEW: 0,
  ACCEPT: 1,
  REJECT: 2,
  BLOCK: 3,
  REVOKE: -1
}

module.exports = Friendship;
