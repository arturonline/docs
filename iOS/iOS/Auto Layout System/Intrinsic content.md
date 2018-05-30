# Intrinsic content size

## Content size

All views have an intrinsic content size, which refers to the amount of space the view needs for its content to appear in an ideal state. For example, the intrinsic content size of a UILabel will be the size of the text it contains using whatever font you have configured it to use.

All views have a content compression resistance priority and a content hugging priority that determine how much it fights to retain its intrinsic content size when available space is less than or greater than it needs, respectively.

### Content Hugging priorities

Its the priority with which a view resists being made larger than its intrinsic size.

The view with the higher content hugging priority is the one that does not stretch.

### Content compression resistance priorities

The content compression resistance priorities determine how much a view resistes getting smaller than its intrinsic content size.

The view with the greater content compression resistance priority is the one that will resist compression and, therefore, not truncate its text.