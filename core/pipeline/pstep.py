class PipelineStep():
    def __init__(self):
        self.items = []

    def read(self):
        raise NotImplementedError()

    def process_item(self, item):
        raise NotImplementedError()

    def run(self):
        items = self.read()
        items_to_write = []
        for item in items:
            try:
                processed_items = self.process_item(item)
                items_to_write.extend(processed_items)
            except:
                self.log_fail(item)
        self.write(items_to_write)

    def log_fail(self, item):
        #TODO: log item
        pass

    def write(self, item):
        raise NotImplementedError() 
