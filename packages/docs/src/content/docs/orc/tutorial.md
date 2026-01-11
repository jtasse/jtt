---
title: "Tutorial: Decommissioning a Satellite"
description: Learn how to safely remove a satellite from orbit and how to abort the procedure if necessary.
head: []
---

import { Steps } from '@astrojs/starlight/components';

:::note[Learning Goal]
By the end of this tutorial, you will be able to select a satellite, initiate a decommission sequence, and reset the operation.
:::

<Steps>

1. **Select a Target Satellite**

   Locate the **Available Satellites** list in the sidebar on the left.

   Click on any satellite name (e.g., `Sat-Alpha` or `Sat-Beta`).

   *Observe:* The camera automatically moves to focus on the selected satellite, and its details appear in the **Satellite Info** pane.

2. **Initiate Decommission**

   With a satellite selected, look at the **Actions** pane below the satellite list.

   Click the **Decommission Satellite** button.

   *Observe:* The robotic hand activates and begins moving toward the target satellite to capture it.

3. **Cancel the Operation**

   If you realize you have selected the wrong target or wish to stop the simulation, you can abort the process immediately.

   Locate the **Reset Scene** button at the very top of the sidebar.

   Click **Reset Scene**.

   *Result:* The robotic hand retracts, the camera resets, and the satellite returns to its operational state.

</Steps>

## Conclusion

You have successfully performed a decommission cycle and learned how to reset the simulation. You can repeat these steps for any satellite in the list to practice managing orbital debris.

:::tip[Next Steps]
Now that you know the basics, try exploring the [User Guide](/portfolio/docs/orc/user-guide/) to learn about the different satellite status indicators.
:::
