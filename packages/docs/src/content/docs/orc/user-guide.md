---
title: ORC User Guide
description: Complete guide to the Orbital Refuse Collector interface and features
head: []
---

## Overview

The Orbital Refuse Collector (ORC) demo showcases a fictional 3D satellite management interface. You can select satellites orbiting Earth, view their telemetry data, and simulate decommissioning procedures.

:::note[Enjoy the demo without fear!]
This is a demonstration interface. No actual satellites will be harmed by your actions.
:::

## Interface Guide

### Orbit Types

The ORC system supports decommission of satellites with the following orbit types:

| Orbit Type      | Shorthand | Color   | Altitude (km)                                 | Eccentricity |
| :-------------- | :-------- | :------ | :-------------------------------------------- | ------------ |
| Low Earth Orbit | LEO       | Green   | 160–2,000                                     | Low          |
| Geostationary   | GEO       | Magenta | 35,786                                        | None         |
| Molniyan        | MOL       | Orange  | - perigee: 500–600<br>- apogee: 39,000–40,000 | High         |

### 3D Viewport

The main viewport displays Earth with orbiting satellites and the robotic hand actuator.

### Satellite List

The `Orbital Refuse Collector Demo` toolbar displays all trackable satellites. Click any satellite to:

> **NOTE**: normally the toolbar is positioned on the right side of the page; but if your browser window is smaller (for example: if you are using a mobile device), then the toolbar will appear at the bottom of the page.

- Highlight it in the 3D view
- Display its telemetry in the `Satellite Info` panel

### Satellite Info Panel

Shows details about the selected satellite:

- **ID** - Unique satellite identifier
- **Orbit Type** - Low Earth Orbit, Geostationary, or Molniyan
- **Status** - Current operational status

## Actions

### Decommission Satellite

Simulates the satellite decommissioning process:

1. **Select Target**

   Click a satellite from the `Available Satellites` list to select it as the decommission target.

2. **Initiate Decommission**

   Click the `Decommission Satellite` button in the `Actions` panel.

3. **Watch the Sequence**

   The robotic hand will travel to the satellite and perform the capture maneuver.

:::tip[Pro Tip]
The camera automatically follows the hand during decommissioning. After completion, you can select another satellite to continue.
:::

### Reset Scene

Click `Reset Scene` to restore all satellites to their original operational state.

## Camera Controls

While in the ORC demo, camera controls are managed automatically to provide optimal viewing angles. The smart camera system:

- Follows the hand during decommission sequences
- Focuses on selected satellites
- Provides smooth transitions between views

## API Integration

The ORC demo connects to a RESTful API for satellite data. Full API documentation is available for developers who want to integrate with the system.

```
GET /api/satellites
GET /api/satellites/{id}
POST /api/satellites/{id}/decommission
```

See the [API Reference](/portfolio/docs/orc/api-reference/) for complete endpoint documentation.

:::caution[Rate Limiting]
API requests are limited to 100 requests per minute.
:::

## Troubleshooting

### Satellite not responding to selection

While you _can_ select a satellite by clicking on it in the 3D interface, you'll likely find it easier to select it from the `Available Satellites` list in the toolbar.

### Camera stuck or not moving

Click `Reset Scene` to restore default camera behavior.

### Performance issues

The 3D scene is optimized for modern browsers. For best performance:

- Use Chrome, Firefox, or Safari (latest versions)
- Ensure hardware acceleration is enabled
- Close other GPU-intensive applications
