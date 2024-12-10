"use client";

import dataProviderSimpleRest from "@refinedev/simple-rest";

const API_URL = "http://localhost:3100/api";

export const dataProvider = dataProviderSimpleRest(API_URL);
