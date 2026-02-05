---
title: ORC System Architecture
description: Autonomous Debris Mitigation for Low Earth Orbit and Beyond
head: []
---

:::note[Abstract]
The Orbital Refuse Collector (ORC) is a satellite deorbiting solution designed to address the growing threat of satellite congestion (see also: [Kessler Syndrome](https://en.wikipedia.org/wiki/Kessler_syndrome){.external-link}). By utilizing a high-dexterity robotic actuator ("The Hand or ORC") and proprietary targeting capabilities; ORC can identify and deorbit defunct satellites without creating additional fragments.
:::

## 1. Introduction

Space debris poses a critical threat to the sustainability of orbital operations. With thousands of satellites launched annually, the density of orbital objects—especially those in Low Earth Orbit (LEO)—is approaching a tipping point. Traditional deorbiting methods rely on a satellite's own propulsion, but this is ineffective for satellites that have run out of fuel or sustained critical damage.

The ORC system provides an active removal solution capable of servicing targets in multiple orbits.

## 2. System Overview

The ORC System uses a network of sensors to track customer satellites. When a customer initiates decommission for a satellite, this request is queued until the Debris Capture System—commonly known as "The Hand of ORC"—becomes available to complete the decommission process.

### Core Components

- **The Hand:** A multi-jointed robotic manipulator with adaptive grip technology. It can conform to irregular shapes, allowing it to grasp solar panels, antennas, or main bodies of debris.

- **Sensor Suite:** A combination of LIDAR, optical cameras, and infrared sensors provides real-time telemetry and 3D mapping of the target object.

- **Power Generation:** An S9G reactor nuclear acts as the primary power source, with solar panels serving as a backup.

- **Propulsion:** High-efficiency ion drives allow for extended mission duration and significant orbital plane changes.

## 3. Operational Workflow

The decommissioning process follows a strict four-phase protocol to ensure safety and mission success.

### Phase 1: Identification & Tracking

Ground stations upload target vectors to the Hand, and its onboard AI verifies the target using visual recognition to confirm identity and assess structural integrity.

### Phase 2: Intercept

The Hand calculates an intercept solution that minimizes power usage and approaches the satellite until it's within deorbiting range.

### Phase 3: Deorbit

The deorbiting methodology used is determined by the target satellite's orbit type.

#### Low Earth Orbit (LEO)

The Hand closes to within pincer range and joins its thumb and index finger, building tension as it forms the 'OK' gesture. Next, the Hand releases this tension and uses its index finger to flick the satellite into the Earth's atmosphere at an angle sufficient to facilitate vaporizing the satellite in its entirety.

#### Geostationary Orbit (GEO)

After placing its target between itself in and the Earth, the Hand closes into a fist. After a short period of reverse thrust, the Hand closes the distance to the target, punching it into Earth's mesosphere, where it's physically disincorporated.

#### Molniyan Orbit (MOL)

As with the GEO deorbiting methodology, the hand lines up behind its target relative to the Earth. However, instead of forming a fist, the hand straightens and, using the thrusters in its fingertips, it readies itself. Then, with a quick burst of thrust from opposite its palm; the Hand performs a slap maneuver that sends the satellite hurtling toward a fast but complete fiery mesospheric demise.

### Phase 4: Disengagement

The Hand then performs a separation maneuver to return to a parking orbit.

## 4. Technical Specifications

:::note
Specifications are for the Mark IV model currently in operation.
:::

| Specification       | Value                |
| ------------------- | -------------------- |
| Mass (dry)          | 450 kg               |
| Delta-V Budget      | 3,200 m/s            |
| Actuator Reach      | 4.5 meters           |
| Grip Force          | Variable, 5N to 500N |
| Power Generation    | 2.5 kW (Solar)       |
| Mission Duration    | Up to 10 years       |
| Targets per Mission | 3-5                  |

## 5. Safety Considerations

The ORC system incorporates multiple safety measures:

- **Collision Avoidance:** Real-time tracking of nearby objects with automatic abort triggers
- **Debris Containment:** Capture mechanisms designed to prevent fragmentation
- **Fail-Safe Protocols:** Automatic safe mode if communication is lost

## 6. Future Roadmap

Future iterations of the ORC system will include in-orbit recycling capabilities, allowing captured materials to be processed into raw feedstock for orbital manufacturing, rather than being destroyed in the atmosphere.

### Planned Enhancements

1. **ORC Mark V** - Increased actuator dexterity for smaller debris
2. **ORC Mark VI** - On-orbit material processing capability
3. **ORC Constellation** - Coordinated multi-unit debris clearing operations
