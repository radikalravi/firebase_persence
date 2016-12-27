/*
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Tests for idp.js.
 */

goog.provide('firebaseui.auth.idpTest');

goog.require('firebaseui.auth.idp');
goog.require('goog.testing.jsunit');
goog.require('goog.testing.recordFunction');

goog.setTestOnly('firebaseui.auth.idpTest');


var firebase = {};


function setUp() {
  // Record all calls to AuthProvider.credential
  firebase.auth = {};
  for (var providerId in firebaseui.auth.idp.AuthProviders) {
    firebase.auth[firebaseui.auth.idp.AuthProviders[providerId]] = {
      'credential': goog.testing.recordFunction(function() {
        // Return something.
        return providerId;
      })
    };
  }
}


function tearDown() {
  firebase = {};
}


function testIsSupportedProvider() {
  assertTrue(firebaseui.auth.idp.isSupportedProvider('password'));
  assertTrue(firebaseui.auth.idp.isSupportedProvider('google.com'));
  assertTrue(firebaseui.auth.idp.isSupportedProvider('facebook.com'));
  assertTrue(firebaseui.auth.idp.isSupportedProvider('github.com'));
  assertTrue(firebaseui.auth.idp.isSupportedProvider('twitter.com'));

  assertFalse(firebaseui.auth.idp.isSupportedProvider('Google'));
  assertFalse(firebaseui.auth.idp.isSupportedProvider('google'));
  assertFalse(firebaseui.auth.idp.isSupportedProvider('yahoo.com'));
  assertFalse(firebaseui.auth.idp.isSupportedProvider('foobar'));
}


/**
 * Asserts the credential is initialized with correct OAuth response.
 * @param {!Object} provider The provider object.
 * @param {!Object} oauthResponse The response used to initialize the
 *     credential.
 * @param {!Object} ref The credential reference.
 */
function assertCredential(provider, oauthResponse, ref) {
  assertNotNullNorUndefined(ref);
  var parameter = provider.credential.getLastCall().getArgument(0);
  for (var key in oauthResponse) {
    assertEquals(oauthResponse[key], parameter[key]);
  }
}


function testGetAuthCredential_google() {
  var cred = {
    'provider': 'google.com',
    'idToken': 'ID_TOKEN',
    'accessToken': 'ACCESS_TOKEN'
  };
  var ref = firebaseui.auth.idp.getAuthCredential(cred);
  assertCredential(
      firebase.auth.GoogleAuthProvider,
      {
        'idToken': 'ID_TOKEN',
        'accessToken': 'ACCESS_TOKEN'
      },
      ref);
}


function testGetAuthCredential_facebook() {
  var cred = {
    'provider': 'facebook.com',
    'accessToken': 'ACCESS_TOKEN'
  };
  var ref = firebaseui.auth.idp.getAuthCredential(cred);
  assertCredential(
      firebase.auth.FacebookAuthProvider,
      {
        'accessToken': 'ACCESS_TOKEN'
      },
      ref);
}


function testGetAuthCredential_twitter() {
  var cred = {
    'provider': 'twitter.com',
    'accessToken': 'ACCESS_TOKEN',
    'secret': 'SECRET'
  };
  var ref = firebaseui.auth.idp.getAuthCredential(cred);
  assertCredential(
      firebase.auth.TwitterAuthProvider,
      {
        'oauthToken': 'ACCESS_TOKEN',
        'oauthTokenSecret': 'SECRET'
      },
      ref);
}


function testGetAuthCredential_github() {
  var cred = {
    'provider': 'github.com',
    'accessToken': 'ACCESS_TOKEN'
  };
  var ref = firebaseui.auth.idp.getAuthCredential(cred);
  assertCredential(
      firebase.auth.GithubAuthProvider,
      {
        'accessToken': 'ACCESS_TOKEN'
      },
      ref);
}


function testGetAuthCredential_invalid() {
  var cred = {
    'provider': 'unknown.com',
    'accessToken': 'ACCESS_TOKEN'
  };
  assertNull(firebaseui.auth.idp.getAuthCredential(cred));
  assertNull(firebaseui.auth.idp.getAuthCredential({}));
}
