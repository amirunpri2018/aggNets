# aggNets

This is an R package that is meant to build network visualizations in D3.  There are several packages that help make simple D3 networks via R, but there are a few notable weaknesses in these packages:

1. Networks are almost always force directed (especially in the networkD3 package).

This creates a few problems.  First, often it use useful to look at different network layouts for different types of data.  Force directed graphs are only one way to layout graphs.  Second, and more importantly, force directed graphs are very slow with large numbers of nodes.  Finally, some people find force networks distracting due to the constant movement of the nodes.

2. Options are limited (especially in the sigma package).

Sigma.js is a full-featured graph library, but the R htmlwidget doesn't make it easy to use most of these features.  It might be useful to create a better htmlwidget for sigma.js, but fewer people know sigma.js compared to D3.  

This package aims to address these issues by doig the following:

1. Use R to learn network layouts - this will increase the variety of layouts possible.
2. Use the htmlwidgets framework to draw a D3 visualization of the learned network.
3. Be able to draw to canvas (instead of SVG) to enable larger networks.
4. Allow for custom color schemes (by providing a column with custom colors).
5. Options for subsetting via interaction (on-click, on-hover, etc.).
6. Customizable popups.
7. Time-series network visualizations.
8. Optional network aggregation (e.g., show all edges, or just one edge if nodes had any interaction).
9. Options to show different edge types (e.g., curved vs. straight, arrow vs. line, edge width?)

Some of these options are ambitious, but creating a simple, fast, and clean package that can both layout and visualize graphs will be very useful - especially for R users who do not know D3/javascript.

