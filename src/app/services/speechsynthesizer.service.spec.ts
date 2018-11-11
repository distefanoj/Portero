import { TestBed, inject } from '@angular/core/testing';

import { SpeechsynthesizerService } from './speechsynthesizer.service';

describe('SpeechsynthesizerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SpeechsynthesizerService]
    });
  });

  it('should be created', inject([SpeechsynthesizerService], (service: SpeechsynthesizerService) => {
    expect(service).toBeTruthy();
  }));
});
