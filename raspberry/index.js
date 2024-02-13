/**
 * Copyright 2024  Ievgenii Tkachenko
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *   http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


(async () => {
    require("./proto.js");
    require("./core.js");
    await core.db.executor.checkDatabase();
    require('./server_http.js');
    core.controller.relay.internal.startPeriodingChecking();
})().catch(err => console.error(err));

// TEST NGINX CONFIG!!!!

