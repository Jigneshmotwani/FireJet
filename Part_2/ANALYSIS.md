## AIM: Draft an algorithm to merge the two intermediate representations into a single one for outputting to code.

### Part 1: Create visualizations and perform analysis, using typescript code or otherwise, on the intermediate representations

My first task was to undertsand what information I had available. So I reviewed the JSON files for both Mobile and Desktop. I analysied the 3-fixed-scene-nodes (hierachy) files to create a tree structure containing all the nodes and their children.  This tree structure can be found below and at 'Desktop_1.txt' and 'Mobile_1.txt' files.

#### Desktop Tree Structure 
``` 
Landing
├── T[Logo-FireJet, Docs, Blog, Pricing, Discord, Login, Button, Account circle]
│   ├── Logo-FireJet
│   └── T[Docs, Blog, Pricing, Discord, Login, Button, Account circle]
│       ├── Docs
│       ├── Blog
│       ├── Pricing
│       ├── Discord
│       ├── Login
│       ├── Button
│       │   └── Sign Up
│       └── Account circle
├── T[Figma, Design, to, Frame 8, Code]
│   ├── Figma
│   ├── Design
│   ├── to
│   ├── Frame 8
│   │   └── Readable
│   └── Code
├── Turn your Figma components into human-readable React code with a single *CLICK*
├── T[Button]
│   └── Button
│       └── Sign Up
├── T[T[Frame 1, Human Readability, Code readability optimized, Learn More, bx:arrow-back], Import from Figma, Build your application]
│   ├── Frame 1
│   │   ├── download (2)
│   │   ├── Human Readability
│   │   ├── Code readability optimized
│   │   └── T[Learn More, bx:arrow-back]
│   │       ├── Learn More
│   │       └── bx:arrow-back
│   └── Import from Figma
│       ├── Build your application
│       └── T[Learn More, bx:arrow-back]
├── Don’t take our word for it
├── Trust our customers
├── T[UserCard, UserCard, UserCard]
│   ├── UserCard
│   │   ├── Text
│   │   └── T[Philip Raw Hi Fidelity - Square 1, UserName, UserJob]
│   │       ├── Philip Raw Hi Fidelity - Square 1
│   │       ├── UserName
│   │       └── UserJob
│   └── UserCard (repeated structure as above)
└── T[Footer]
    ├── T[Get in Touch, Links, Subscribe]
    │   ├── Get in Touch
    │   │   ├── fluent:call-16-filled
    │   │   ├── ic:round-email
    │   │   ├── file-icons:telegram
    │   │   └── carbon:location-filled
    │   ├── Links
    │   │   ├── Home
    │   │   ├── Pricing
    │   │   ├── About Us
    │   │   └── Blog
    │   └── Subscribe
    │       ├── Get our BEST updates
    │       ├── Frame 4931, Button
    │       └── Set the world on Fire🔥

```

#### Mobile Tree Structure
```
Landing
├── T[Logo-FireJet, Button, Account circle]
│   ├── Logo-FireJet
│   └── T[Button, Account circle]
│       ├── Button
│       │   └── Sign Up
│       └── Account circle
├── T[Figma, Design, to]
│   ├── Figma
│   ├── Design
│   └── to
├── T[Frame 8, Code]
│   ├── Frame 8
│   │   └── Readable
│   └── Code
├── Turn your Figma components into human-readable React code with a single *CLICK*
├── T[Button]
│   └── Button
│       └── Sign Up
├── T[Frame 1, Human Readability, Code readability optimized, Learn More, bx:arrow-back]
│   ├── Frame 1
│   │   └── download (2)
│   ├── Human Readability
│   ├── Code readability optimized
│   └── T[Learn More, bx:arrow-back]
│       ├── Learn More
│       └── bx:arrow-back
├── T[Frame 1, Layout Responsive, Fully responsive code outputs, Learn More, bx:arrow-back]
│   ├── Frame 1
│   │   └── download (2)
│   ├── Layout Responsive
│   ├── Fully responsive code outputs
│   └── T[Learn More, bx:arrow-back]
│       ├── Learn More
│       └── bx:arrow-back
├── T[Frame 1, Pixel Perfection, 100% pixel perfection, Learn More, bx:arrow-back]
│   ├── Frame 1
│   │   └── download (2)
│   ├── Pixel Perfection
│   ├── 100% pixel perfection
│   └── T[Learn More, bx:arrow-back]
│       ├── Learn More
│       └── bx:arrow-back
├── T[Frame 1, Tailwind CSS, Generate code in Tailwind, Learn More, bx:arrow-back]
│   ├── Frame 1
│   │   └── download (2)
│   ├── Tailwind CSS
│   ├── Generate code in Tailwind
│   └── T[Learn More, bx:arrow-back]
│       ├── Learn More
│       └── bx:arrow-back
├── T[UserCard]
│   ├── Text
│   └── T[Philip Raw Hi Fidelity - Square 1, UserName, UserJob]
│       ├── Philip Raw Hi Fidelity - Square 1
│       ├── UserName
│       └── UserJob
├── Don’t take our word for it
├── Trust our customers
└── T[Footer]
    ├── T[Get in Touch, Links, Subscribe]
    │   ├── Get in Touch
    │   │   ├── fluent:call-16-filled
    │   │   ├── ic:round-email
    │   │   ├── file-icons:telegram
    │   │   └── carbon:location-filled
    │   ├── Links
    │   │   ├── Home
    │   │   ├── Pricing
    │   │   ├── About Us
    │   │   └── Blog
    │   └── Subscribe
    │       ├── Get our BEST updates
    │       ├── Frame 4931, Button
    │       └── Set the world on Fire🔥

```

I looked for the following 3 things while analyzing the files:  
1. Components that appear in both diagrams (potentially with different properties).
2. Components that are unique to one version.
3. Variations in the hierarchy or layout adjustments specific to each breakpoint.

| Desktop Representation | Mobile Representation |
| --------------------- | --------------------- |
|Contains elements like Logo, Docs, Blog, Pricing, Discord, Login, Button (Sign Up), Account circle, and other frames and texts.|Similar structure with some elements rearranged or resized for smaller screens.|
|Elements have properties such as 'id', 'name', 'children', 'position', 'size', 'visibility', and 'styles'.|Contains additional elements specific to mobile design or excludes elements not needed on mobile.|


### Part 2: List all the scenarios that need to be accounted for during the merge
1. **Consistent Elements**: Elements that are present in both desktop and mobile designs without significant changes. These elements have the same properties, such as color, font, and basic layout, regardless of the device.  
   Example: A company logo that is displayed in the same way on both desktop and mobile versions of a website.  
   ```
   {
        "id": "logo",
        "name": "Company Logo",
        "visible": true,
        "style": {
            "common": {
                "color": "#000000",
                "fontFamily": "Arial",
                "fontSize": 24
            }
        }
    }
    ```

2. **Unique Elements**: Elements present in only one design (either desktop or mobile).  
    Example: A navigation bar present only on the desktop version but hidden or replaced with a hamburger menu on the mobile version.  
    ```
    {
        "id": "navbar",
        "name": "Navigation Bar",
        "visible": true,
        "style": {
            "desktop": {
                "display": "block"
            },
            "mobile": {
                "display": "none"
            }
        }
    }
    ```

3. **Different Properties**: Elements that exist in both designs but have different properties such as size, position, or visibility.  
   Example:A button that is larger and positioned differently on desktop compared to mobile.  
   ```
    {
        "id": "signup-button",
        "name": "Sign Up Button",
        "visible": true,
        "style": {
            "common": {
                "color": "#FFFFFF",
                "backgroundColor": "#FF0000"
            },
            "desktop": {
                "position": { "x": 100, "y": 200 },
                "size": { "width": 150, "height": 50 }
            },
            "mobile": {
                "position": { "x": 50, "y": 150 },
                "size": { "width": 100, "height": 40 }
            }
        }
    }
   ```
4. Responsive Behaviors: Elements that change behavior or appearance based on viewport size. These changes could be due to CSS media queries, JavaScript, or other dynamic adjustments.  
   Example: A text box that becomes a drop-down menu on smaller screens.
   ```
    {
        "id": "search-box",
        "name": "Search Box",
        "visible": true,
        "style": {
            "common": {
                "border": "1px solid #000000"
            },
            "desktop": {
                "type": "textbox",
                "size": { "width": 200, "height": 30 }
            },
            "mobile": {
                "type": "dropdown",
                "size": { "width": 150, "height": 40 }
            }
        }
    }
   ```
5. Nested Elements: Elements that have different parent-child relationships in desktop and mobile designs. These elements may be nested within different containers or have different hierarchies based on the viewport.  
   Example: A footer that contains social media links arranged horizontally on desktop but stacked vertically on mobile.
   ```
   {
        "id": "footer",
        "name": "Footer",
        "visible": true,
        "children": [
            {
                "id": "social-links",
                "name": "Social Links",
                "visible": true,
                "style": {
                    "common": {
                        "color": "#000000"
                    },
                    "desktop": {
                        "layout": "horizontal",
                        "children": [
                            { "id": "facebook", "name": "Facebook" },
                            { "id": "twitter", "name": "Twitter" }
                        ]
                    },
                    "mobile": {
                        "layout": "vertical",
                        "children": [
                            { "id": "facebook", "name": "Facebook" },
                            { "id": "twitter", "name": "Twitter" }
                        ]
                    }
                }
            }
        ]
    }
   ```


### Part 3: Describe, with pseudo code, typescript, or otherwise, your approach to merge the intermediate representations

I have designed the Merging Algorithm in the following steps:
1. Find elements that are present in both desktop and mobile IRs.
2. For each common element, merge properties by prioritizing desktop or mobile styles or by setting responsive attributes.
3. Add unique elements from each IR to the final representation conditionally based on the viewport size.
4. Ensure that merged elements maintain a consistent look and feel across breakpoints.

Pseude-code in typescript:  

```
// Function to merge two intermediate representations
function mergeDesigns(desktopIR, mobileIR) {
    let responsiveIR = [];

    // Step 1: Merge common elements with responsive adaptations
    desktopIR.forEach(desktopNode => {
        let mobileNode = findNodeById(mobileIR, desktopNode.id);
        if (mobileNode) {
            let responsiveNode = mergeNodes(desktopNode, mobileNode);
            responsiveIR.push(responsiveNode);
        } else {
            // Desktop only node, add it with default desktop properties
            responsiveIR.push(applyDefaultBreakpoint(desktopNode, 'desktop'));
        }
    });

    // Step 2: Add unique mobile nodes
    mobileIR.forEach(mobileNode => {
        if (!findNodeById(responsiveIR, mobileNode.id)) {
            responsiveIR.push(applyDefaultBreakpoint(mobileNode, 'mobile'));
        }
    });

    return responsiveIR;
}

// Function to merge properties of two nodes
function mergeNodes(desktopNode, mobileNode) {
    let mergedNode = {};

    // Merge basic properties
    mergedNode.id = desktopNode.id;
    mergedNode.name = desktopNode.name;
    mergedNode.visible = desktopNode.visible && mobileNode.visible;

    // Merge styles with responsive attributes
    mergedNode.style = {
        common: { ...desktopNode.style.common, ...mobileNode.style.common },
        desktop: { ...desktopNode.style.desktop },
        mobile: { ...mobileNode.style.mobile }
    };

    // Merge children recursively
    if (desktopNode.children && mobileNode.children) {
        mergedNode.children = mergeDesigns(desktopNode.children, mobileNode.children);
    }

    return mergedNode;
}

// Function to apply default breakpoint styles
function applyDefaultBreakpoint(node, breakpoint) {
    let styledNode = { ...node };
    styledNode.style = {
        common: { ...node.style.common },
        [breakpoint]: { ...node.style }
    };
    return styledNode;
}

// Helper function to find a node by ID
function findNodeById(ir, id) {
    for (let node of ir) {
        if (node.id === id) return node;
    }
    return null;
}

```

Detailed example:
Let's say we have 2 IR's for desktop and mobile, we'll go through an example of merging them:  

**Desktop Representation (simplified)**:
```
{
    "id": "180:167",
    "name": "Logo-FireJet",
    "visible": true,
    "style": {
        "position": { "x": 48, "y": 32 },
        "size": { "width": 142, "height": 54 },
        "color": "#000000"
    }
}
```

**Mobile Representation (simplified)**:
```
{
    "id": "180:167",
    "name": "Logo-FireJet",
    "visible": true,
    "style": {
        "position": { "x": 20, "y": 20 },
        "size": { "width": 100, "height": 40 },
        "color": "#000000"
    }
}
```

The merged representation after running through the algorithm is
```
{
    "id": "180:167",
    "name": "Logo-FireJet",
    "visible": true,
    "style": {
        "common": {
            "color": "#000000"
        },
        "desktop": {
            "position": { "x": 48, "y": 32 },
            "size": { "width": 142, "height": 54 }
        },
        "mobile": {
            "position": { "x": 20, "y": 20 },
            "size": { "width": 100, "height": 40 }
        }
    }
}
```

#### If m is the number of elements in the mobile IR and n is the number of elements in the desktop IR,  
#### Time Complexity = O(n⋅m+m<sup>2</sup>)  
####cSpace Complexity = O(n+m)

### Part 4: List any possible edge cases with your algorithm
1. Elements that have interactive behaviors or dynamic properties that change based on user interactions.
2. When the nesting of elements differs significantly between desktop and mobile versions, leading to a complex hierarchy that cannot be easily reconciled.
3. Elements that are visible or hidden based on complex conditions that are not strictly related to viewport size.
4. Elements whose properties depend on the properties of other elements, such as relative positioning.