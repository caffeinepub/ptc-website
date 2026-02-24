import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Nat "mo:core/Nat";

import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";

actor {
  // Data types
  type UserProfile = {
    username : Text;
    email : Text;
    registrationDate : Int;
    balance : Nat;
  };

  type Ad = {
    id : Nat;
    title : Text;
    description : Text;
    url : Text;
    duration : Nat;
    rewardAmount : Nat;
  };

  type AdWatch = {
    adId : Nat;
    user : Principal;
    watchDate : Int;
  };

  type WithdrawalRequest = {
    user : Principal;
    amount : Nat;
    requestDate : Int;
    status : {
      #pending;
      #approved;
      #rejected;
    };
  };

  // State
  let userProfiles = Map.empty<Principal, UserProfile>();
  let ads = Map.empty<Nat, Ad>();
  let adWatches = List.empty<AdWatch>();
  let withdrawalRequests = List.empty<WithdrawalRequest>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // Add initial ads in constructor
  public shared ({ caller }) func initialize() : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action.");
    };
    if (ads.isEmpty()) {
      let initialAds : [Ad] = [
        {
          id = 1;
          title = "Watch our Product Demo";
          description = "Learn about our new product line.";
          url = "https://www.youtube.com/watch?v=_bC60nonKds&list=PLLcvlnbMyv680rfM8nPRvxCJP6RNeYH76";
          duration = 60;
          rewardAmount = 100;
        },
        {
          id = 2;
          title = "Exclusive Offer";
          description = "Get a special discount just for watching.";
          url = "https://www.youtube.com/watch?v=uTt1871utT8";
          duration = 45;
          rewardAmount = 100;
        },
        {
          id = 3;
          title = "Brand Awareness";
          description = "Support our brand by viewing this ad.";
          url = "https://www.youtube.com/watch?v=xv2c7eTnPqc";
          duration = 30;
          rewardAmount = 100;
        },
        {
          id = 4;
          title = "Limited Time Promotion";
          description = "Don't miss out on this exclusive promotion.";
          url = "https://www.youtube.com/watch?v=OE9Tc1bYIQE";
          duration = 90;
          rewardAmount = 100;
        },
        {
          id = 5;
          title = "Watch & Earn Promo";
          description = "Try our new service and get rewards.";
          url = "https://www.youtube.com/watch?v=AKCWNoFYvE4";
          duration = 75;
          rewardAmount = 100;
        },
      ];
      for (ad in initialAds.values()) {
        ads.add(ad.id, ad);
      };
    };
  };

  // User profile functions

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access their profile");
    };
    userProfiles.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save their profile");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public query func getAvailableAds() : async [Ad] {
    ads.values().toArray();
  };

  public query func getAd(id : Nat) : async ?Ad {
    ads.get(id);
  };

  public shared ({ caller }) func claimAd(adId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can claim ads");
    };

    let userProfile = switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) { profile };
    };

    let ad = switch (ads.get(adId)) {
      case (null) { Runtime.trap("Ad not found") };
      case (?a) { a };
    };

    let today : Int = Time.now() / (24 * 60 * 60 * 1000000000);
    let alreadyWatchedToday = adWatches.any(
      func(watch : AdWatch) : Bool {
        watch.adId == adId and watch.user == caller and watch.watchDate == today
      }
    );

    if (alreadyWatchedToday) {
      Runtime.trap("Ad already claimed today");
    };

    let watch : AdWatch = {
      adId;
      user = caller;
      watchDate = today;
    };
    adWatches.add(watch);

    let earnedAmount = userProfile.balance + ad.rewardAmount;
    let updatedProfile : UserProfile = {
      userProfile with balance = earnedAmount
    };
    userProfiles.add(caller, updatedProfile);
  };

  public query ({ caller }) func getDashboardStats() : async {
    totalBalance : Nat;
    adsWatchedToday : Nat;
    totalAdsWatched : Nat;
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view dashboard stats");
    };

    let userProfile = switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) { profile };
    };

    let today : Int = Time.now() / (24 * 60 * 60 * 1000000000);

    var adsWatchedToday : Nat = 0;
    var totalAdsWatched : Nat = 0;

    for (watch in adWatches.values()) {
      if (watch.user == caller) {
        totalAdsWatched += 1;
        if (watch.watchDate == today) {
          adsWatchedToday += 1;
        };
      };
    };

    {
      totalBalance = userProfile.balance;
      adsWatchedToday;
      totalAdsWatched;
    };
  };

  public query ({ caller }) func getCallerAdWatches() : async [AdWatch] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their ad watch history");
    };
    adWatches.filter(func(watch : AdWatch) : Bool { watch.user == caller }).toArray();
  };

  public shared ({ caller }) func requestWithdrawal(amount : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can request withdrawals");
    };

    let userProfile = switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) { profile };
    };

    if (amount < 500) {
      Runtime.trap("Minimum withdrawal amount is $500");
    };

    if (userProfile.balance < amount) {
      Runtime.trap("Insufficient balance");
    };

    let request : WithdrawalRequest = {
      user = caller;
      amount;
      requestDate = Time.now();
      status = #pending;
    };

    let updatedProfile : UserProfile = {
      userProfile with balance = userProfile.balance - amount
    };
    userProfiles.add(caller, updatedProfile);

    withdrawalRequests.add(request);
  };

  public query ({ caller }) func getCallerWithdrawalHistory() : async [WithdrawalRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their withdrawal history");
    };
    withdrawalRequests.filter(func(req : WithdrawalRequest) : Bool { req.user == caller }).toArray();
  };

  public query ({ caller }) func getAllWithdrawalRequests() : async [WithdrawalRequest] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all withdrawal requests");
    };
    withdrawalRequests.toArray();
  };
};
