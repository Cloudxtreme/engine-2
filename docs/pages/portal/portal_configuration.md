---
title: "Lucid Mud Engine Portal - Configuration"
keywords: luicid mud engine, mud, mux, moo
tags: [portal, configuration]
sidebar: mydoc_sidebar
permalink: portal_configuration.html
summary: Documentation for the Lucid Mud Engine
---

The portal is configured through the `config/portal.config.js` file. Configuration options are passed into the Portal
constructor directly, and will automatically override any default configurations.

## Configuration Options
### host (**default**: tcp://0.0.0.0:2323)
Specifies the host option for the Portal. This is the address and port that the Portal will listen on on for 
connections. This can be set in the configuration file, or can also be set via the PORTAL_HOST environment variable.
