class PipelineStep():
    def __init__(self):
        self.items = []

    def read(self):
        raise NotImplementedError()

    def process_item(self, item):
        raise NotImplementedError()

    def run(self):
        self.read()
        for item in self.items:
            try:
                processed_item = self.process_items(item)
                self.write(processed_item)
            except:
                self.log_fail(item)

    def log_fail(self, item):
        #TODO: log item
        pass

    def write(self, item):
        raise NotImplementedError() 
