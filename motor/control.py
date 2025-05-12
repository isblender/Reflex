import asyncio
import moteus

async def zero():
    # Create transport using Fdcanusb (USB to CAN adapter)
    transport = moteus.Fdcanusb()
    
    # Create controller for ID 1
    controller = moteus.Controller(id=1, transport=transport)

    # Get initial position for reference
    state = await controller.query()
    initial_pos = state.values[1]  # Position is key 1
    print(f"Initial position: {initial_pos}")
    
    # Move to zero position
    print("Moving to zero position...")
    await controller.set_position(0,0,0.1)
    await asyncio.sleep(0.5)
    await controller.set_stop()
    state = await controller.query()
    final_pos = state.values[1]  # Position is key 1
    print(f"Final position: {final_pos}")

async def support(force):
    """
    Support Function
    Want the motor to provide torque to the lever arm to assist the user in doing the wrist extension while they don't have the strength to do so
    """
    pass

async def resist(force):
    """
    Resistance Function
    Want the motor to provide torque to the lever arm to resister the user performing wrist extensions to furthermore build strength
    """
    pass

if __name__ == '__main__':
    asyncio.run(zero())