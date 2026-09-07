import json

with open('docs/diagrams/src/web3-ecosystem.architecture.json', 'r') as f:
    data = json.load(f)

# The original X positions were: 30, 310, 478, 535, 646, 650, 760, 815, 1030.
# Currently they are +60: 90, 370, 538, 595, 706, 710, 820, 875, 1090.
# And viewBox is 1400.
# Let's restore the original width (1340) and subtract 60 from columns 2 onwards to squish the gap between col 1 and 2!
# Actually, the gap between col 1 (was 30, now 90) and col 2 (was 310) was 280. 
# Let's just put col 1 at 90, and leave the rest at their original positions!
# Original: col 1 = 30. col 2 = 310. Gap = 280. Width of col 1 components = 220.
# 30 + 220 = 250. So 250 to 310 is a gap of 60.
# If we put col 1 at 90, it ends at 310. Then gap to col 2 (310) is ZERO.
# That will cause overlap/clearance errors!

# Okay, let's shift everything left by 60, bringing us back to the original layout, but just shorten the label slightly!
for comp in data.get('components', []):
    if 'pos' in comp:
        comp['pos'][0] -= 60

data['meta']['viewBox'][0] = 1340

# Let's find the boundary label and shorten it. The error was that it extends outside the viewBox.
for b in data.get('boundaries', []):
    if b.get('label', '').startswith('3. '):
        # We'll use a slightly shorter label so it fits without moving components
        # "3. Capa de Datos y Servicios Auxiliares (Mixta On/Off-Chain)"
        # Let's try: "3. Capa de Datos y Servicios Aux. (On/Off-Chain)"
        b['label'] = "3. Capa de Datos y Servicios Aux. (On/Off-Chain)"
        print("Updated label:", b['label'])

with open('docs/diagrams/src/web3-ecosystem.architecture.json', 'w') as f:
    json.dump(data, f, indent=2)
