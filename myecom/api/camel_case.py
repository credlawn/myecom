import re

def snake_to_camel(snake_str):
    
    components = snake_str.split('_')
    return components[0] + ''.join(x.title() for x in components[1:])

def dict_keys_to_camel(d):
    
    return {snake_to_camel(k): v for k, v in d.items()}
